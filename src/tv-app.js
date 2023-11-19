// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "@lrnwebcomponents/video-player/video-player.js";
import "./tv-channel.js";


const data = "../assets/channels.json"
export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display: block;
        margin: 32px;
        padding: 16px;
      }
      .grid-container 
      {
        display: grid;
        grid-template-columns: auto auto;
        background-color: white;
        padding: 10px;
        gap: 10px;
      }
      .grid-item1
      {
          height: 450px;
          width: 600px;
          border: 4px solid rgba(0, 0, 0, 0.8);
          background-color: grey;
      }
      .grid-item2
        {
          height: 700px;
          width: 400px;
          border: 1px solid rgba(0, 0, 0, 0.8);
          background-color: beige;
        }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html `
     <div class="grid-container">
    <div class="grid-item1"><video-player source= 
    "https://www.youtube.com/watch?v=rrc0Y3JMk6Q"></video-player></div>
    <div class="grid-item2">
    </div>
      </div>
    `
    }
     
  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(data) {
    await fetch(data)
      .then((resp) => resp.ok ? resp.json() : [])
      .then((responseData) => {
        if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) 
        {
          this.listings= responseData.data.items.map(item => item.timecode);
          console.log(this.listings);
          this.updateVideoTime();
        }
      });
  }
  
  updateVideoTime() {
    
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);