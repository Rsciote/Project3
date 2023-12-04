// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "@lrnwebcomponents/video-player/video-player.js";
import "./tv-channel.js";



export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.sourceVideo = "https://www.youtube.com/watch?v=rrc0Y3JMk6Q";
    this.currentInfo={
      title: null,
      timecode: null,
      description: null,
    }
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
      currentInfo:{type: Object}
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
      .videoScreen{
        height: 357px;
          width: 700px; 
      } 
      .grid-item2
        {
          height: 700px;
          width: 400px;
          border: 1px solid rgba(0, 0, 0, 0.8);
          background-color: beige;
        }
        .scroll-container 
        {
          width: 350px;
          height: 800px;
          overflow-y: auto;
          padding-top: 5px;
          padding-left: 25px;
        }
        .descriptionSlides
        {
          width: 700px;
          height: 250px;
          background-color: black;
          border:  1px solid red;
        }
        .descriptionContent
        {
          font-size: 16px;
          color: white;

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
      <div class="descriptionSlides">
           <h3 class="descriptionContent"> "${this.currentInfo}"</h3>
      </div>
        </div>
      <div class="grid-item2">
        <div class="scroll-container"> 
        
        

    `
    }
     
    currentItem(e) {
    
      console.log(e.target);
      this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play();
      this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(e.target.timecode);
    }
     descriptionInfo()
     {
  
     }
    currentVidTime()
    {
        const timeNow = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector("a11y-media-player").media.currentTime;
    
        this.listings.forEach((list) => {
          const currentTimecode = list.timecode;
    
          // Check if the absolute difference is within the threshold
          if (Math.abs(timeNow - currentTimecode) < this.timeThreshold) {
            this.currentInfo = list.description;
            return;
          }
        });
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