import { persistr } from '@persistr/js'

export default class PersistrClient {
  public account?: any;
  public repository?: any;
  constructor() {
  }
  public async connect(){
    // TODO: need to update Types
    const castPersistr = persistr as any;

    this.account = await castPersistr.local();
    this.repository = this.account.db('examples').ns('tasks');

    //log events
    this.logEventStream();
  }
  public async write(streamId: string, eventName: string, event: any){
    return await this.repository.stream(streamId).events().write(eventName, event);
  }
  public async subscribe(opt: any, callback: (event: any) => void){
    await this.repository
        .events({ until: 'caught-up' })
        .each(callback)
  }
  private logEventStream() {
      console.log('EVENT STREAM:')
      this.repository.events({ until: 'caught-up' }).each((event: any) => console.log(event.meta.type, event))
  }
}
