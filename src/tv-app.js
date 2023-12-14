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
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.sourceVideo = '';
    this.activeIndex= 0;
    
  }

  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      source: { type: String },
      sourceVideo:{type: String},
      listings: { type: Array },
      active:{type:Boolean, reflect: true},
      activeIndex:{type: Number},
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display: block;
        margin: 64px;
        
      }
      .lecture-grid 
      {
        display: grid;
        grid-template-columns: auto auto;
        background-color: grey;
        padding: 16px;
        gap: 16px;
      }
      .video
      {
          height: 400px;
          width: 600px;
      }
      .lecture-slide-list
        {
          height: 850px;
          width: 400px;
          border: 4px grey;
          background-color: black;
          
        }
        .scrollBar
        {
          width: 350px;
          height: 800px;
          overflow-y: auto;
          align-items: center;
          display: flex;
          flex-direction: column;
          align-items: center; 
        }
        .descriptionInfoBox
        {
          width: 600px;
          height: 100px;
          background-color: black;
        }
        .descriptionContent
        {
          padding-top: 10px;
          font-size: 23px;
          color: white;
          padding-left: 5px;
        }
        .prevButton
        {
          width: 75px;
          height: 35px;
          background-color: white;
          font-size: 15px;
          color: black;
          float: left;
        }
        .nextButton
        {
          width: 75px;
          height: 35px;
          background-color: white;
          font-size: 15px;
          color: black;
         float: right;
        }
      `
    ];
  }
        
      
  // LitElement rendering template of your element
  render() {
    return html `
     
    <div class="lecture-grid">
      <div class="video">
          <video-player source="${this.sourceVideo}"></video-player>
          
          <div class="descriptionInfoBox">
            <h3 class="descriptionContent">${this.listings.length > 0 ? this.listings[this.activeIndex].description : ''}</h3>
      </div>
      
        </div>
      <div class="lecture-slide-list">
      <button class="prevButton" @click="${this.prevSlide}"> Previous</button> <button class="nextButton" @click="${this.nextSlide}"> Next </button>
        <div class="scrollBar"> 
        ${
          this.listings.map(
            (list,index) => html`
            <tv-channel
            ?active="${index === this.activeIndex}"
            index = "${index}"
            title= "${list.title}"
            timecode= "${list.metadata.timecode}"
            @click="${this.currentItem}"
          >
          </tv-channel>
            `
          )
        }
        </div>
      </div>
    </div>
    ;
        
        

    `
    }
     
    connectedCallback() {
      this.changeSlide();
      super.connectedCallback(); 
     }
     prevSlide()
     {
       this.activeIndex--;
     }
     nextSlide()
     {
       this.activeIndex++;
     }

    changeSlide()
{
  
  setInterval(() => {
    const currentTime = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').media.currentTime;

    if (this.activeIndex + 1 < this.listings.length &&
        currentTime >= this.listings[this.activeIndex + 1].metadata.timecode) {
      this.activeIndex++;
     
    }
  }, 1000);
}
  
    

    currentItem(e) {
    
      console.log(e.target);
      this.activeIndex= e.target.index;
      this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play();
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
      if(propName === "activeIndex"){
        var currentLectureSlide = this.shadowRoot.querySelector("tv-channel[index = '" + this.activeIndex + "' ] ");
        this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(currentLectureSlide.timecode);
      }
    
    });
  }

  async updateSourceData(data) {
    await fetch(data)
      .then((resp) => resp.ok ? resp.json() : [])
      .then((responseData) => {
        if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) 
        {
          this.listings = [...responseData.data.items];
          
        }
        
      });
  }
  
  
}

// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);