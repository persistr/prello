import { Persistr, persistr } from "@persistr/js";

export default class BaseProjection {
  private readonly spaceName: string;
  private readonly domainName: string;
  private readonly events: any[];

  private account?: Persistr.Account;
  private space?: Persistr.Space;
  private domain?: Persistr.Domain;
  private subscription: Persistr.Subscription | undefined;
  private componentName: string;
  private handle: Function;

  constructor(
    events: any[],
    spaceName: string,
    domainName: string,
    handle: Function,
    componentName: string
  ) {
    this.events = events;
    this.spaceName = spaceName;
    this.domainName = domainName;
    this.handle = handle;
    this.componentName = componentName;
  }
  protected get name(): string {
    let name: string;
    name = this.constructor.name;
    if (name.includes("Handler")) {
      name = name.split("Handler")[0];
    }
    return `${name}`;
  }
  public async connect() {
    console.log(
      `connecting to ${this.componentName} ${this.constructor.name} ${this.spaceName} ${this.domainName}...`
    );
    if (this.account) {
      return;
    }
    this.account = await persistr.local();
    this.space = await this.account.space(this.spaceName);
    this.domain = await this.space.domain(this.domainName);
    const events = await this.events.map(e => e.name);
    console.log(
      `${this.componentName} ${this.constructor.name} start subscribing! after:${after}`
    );
    // Temporary Switch to filter on BackEnd side
    let query = {};
    query = { types: events };

    await this.domain.events(query).each(async (event, subscription) => {
      console.info(
        this.componentName,
        this.name,
        event.meta.type,
        event.meta ? event.meta.id : "",
        `starting process`,
        event.data.metadata.timestamp
      );

      this.subscription = subscription;
      if (
        event &&
        event.meta &&
        event.meta.type &&
        events.map(event => event.toLowerCase()).includes(event.meta.type)
      ) {
        await this.handle(event, event.meta);
      }
      console.info(
        this.componentName,
        this.name,
        event.meta.type,
        event.meta ? event.meta.id : "",
        `${skiped ? "skipped" : "processed"}`,
        `isLive?: ${this.isReady}`,
        event.data.metadata.timestamp
      );
    });
    console.log(`${this.componentName} ${this.name} is live 🚀 !`);
  }
}
