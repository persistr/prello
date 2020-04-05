import { IEventMetadata } from "../../../infra/IEvent";

/**
 * Base class for all events emitted from commands.
 */
export default abstract class KaterEvent {
  // The event name is included in the response to all commands.
  // Rather than hard coding the names as explicit strings in each class
  // it is better to grab that via reflection and have each event class extend
  // this base one.
  public name: string = this.constructor.name.toLowerCase();
  public abstract metadata: IEventMetadata;

  /**
   * Generic toJSON method that will return a copy of the object's properties as a JSON literal.
   * This is particularly relevant to converting events into objects capable of being piped
   * through PubNub.
   *
   * @returns {any}
   */
  public toJSON(): any {
    const proto = Object.getPrototypeOf(this);
    const jsonObj: any = Object.assign({}, this);

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === "function")
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== "_") {
          try {
            const val = (this as any)[key];
            jsonObj[key] = val;
          } catch (error) {
            console.error(`Error calling getter ${key}`, error);
          }
        }
      });

    return jsonObj;
  }
}
