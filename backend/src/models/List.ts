import Item from "./Item";

export default class List {
  public id: string;
  public items: Item[] = [];
  constructor(id: string) {
    this.id = id;
  }
}
