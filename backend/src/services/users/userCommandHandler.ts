import { Persistr, persistr } from "@persistr/js";
import { KaterEvent } from "krs-backend-es";
import { v4 as uuid } from "uuid";

const RETRY_MAX_ATTEMPTS = Number(process.env.COMMAND_RETRY_MAX_ATTEMPTS);
export default class UserCommandHandler {
  private account?: Persistr.Account;
  private space?: Persistr.Space;
  private domain?: Persistr.Domain;

  public async connect(space: string, domain: string) {
    // When already connected
    if (this.account) {
      return;
    }
    this.account = await persistr.account({
      credentials: { apikey: process.env.PERSISTR_API_KEY }
    });
    this.space = this.account.space(space);

    let domainToConnect = domain;

    if (process.env.NODE_ENV === "test") {
      // check for CI here as well if we are using CI
      // IF this is test env, change domainToConnect to `test_${env.test} or env.heroku,etc.
    }

    this.domain = this.space.domain(domainToConnect);
    console.log(`Connected to Persistr! ${domain} ${space}`);
  }

  public async purge(recreate: boolean = true) {
    if (!this.domain) {
      await this.connect(
        process.env.PERSISTR_SPACE as string,
        process.env.PERSISTR_DOMAIN as string
      );
    }
    try {
      await this.domain!.destroy();
    } catch (e) {
      // ignore
    }

    if (recreate) {
      await this.domain!.create();
    }
  }

  public async writeToStream(
    events: KaterEvent[],
    attemptCounter = 1,
    streamId?: string
  ): Promise<void> {
    let stream: Persistr.Stream;
    try {
      if (streamId) {
        stream = await this.domain!.stream(streamId);
        // console.log("Connected to stream: " + streamId);
      } else {
        streamId = uuid();
        stream = await this.domain!.stream(streamId);
        console.log("Created a new stream: " + streamId);
      }
      const eventObjects = events.map(event => ({
        id: event.metadata.id,
        data: event,
        meta: { type: event.name }
      }));
      await stream.events().write(eventObjects);
      await stream.annotate({
        type: "users"
      });
    } catch (e) {
      if (attemptCounter < RETRY_MAX_ATTEMPTS) {
        // Retry until attempt count hits max
        return await this.writeToStream(events, attemptCounter + 1, streamId);
      }
      throw new Error(
        `Max retries reached for writing events to Stream: ${streamId}`
      );
    }
  }
}
