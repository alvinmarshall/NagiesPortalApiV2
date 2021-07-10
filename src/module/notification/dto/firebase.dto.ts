export interface DataPayload {
  type: string
  level: string
  name: string
  image: string
  title: string
  body: string
  topic: string
}

export class TopicPayload {
  type: string;
  level: string;
  sound: string;
  vibrate: string;
  status: string;

  constructor(private readonly data: DataPayload) {
    this.sound = 'default';
    this.vibrate = 'true';
    this.status = '200';
  }

  getPayload() {
    const data = {
      title: this.data.title,
      body: this.data.body,
      type: this.data.type,
      level: this.data.level,
      name: this.data.name,
      image: this.data.image,
      sound: 'default',
      vibrate: 'true',
      status: '200',
    };
    return { data };
  }


}