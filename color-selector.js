Polymer({
  
  hue: 0,
  
  saturation: 1,
  
  value: 1,
  
  hex: "#ff0000",
  
  ready: function(){
    
    var hueSaturationCanvas = this.$["hue-saturation"];
    
    this.hueSaturationContext = hueSaturationCanvas.getContext("2d");
    
    var valueCanvas = this.$["value"];
    
    this.valueContext = valueCanvas.getContext("2d");
    
    this.HSVtoRGB();
    
  },
  
  observe: {
    
    "hue": "updateHSV",
    
    "saturation": "updateHSV",
    
    "value": "updateHSV"
    
  },
  
  setPreset: function(e){
    
    this.tracking = false;
    
    var color = this.presets[parseInt(e.target.id.slice(e.target.id.lastIndexOf("_") + 1))];
    
    this.RGBtoHSV(color)
    
  },
  
  updateHSV: function(){
    
    this.HSVtoRGB();
    
  },
  
  updateValueGradient: function(r, g, b){
    
    var currentColor = "rgba(" + r + "," + g + "," + b + ",1)"
    
    var valueGradient = this.valueContext.createLinearGradient(0, 100, 0, 0);
    
    valueGradient.addColorStop(0, "black");
    
    valueGradient.addColorStop(1, currentColor);
    
    this.valueContext.fillStyle = valueGradient;
    
    this.valueContext.fillRect(0, 0, 16, 100);
    
  },
  
  updateHueSaturationGradient: function(){
    
    var v = Math.round(this.value * 255);
    
    var hueGradient = this.hueSaturationContext.createLinearGradient(0, 0, 200, 0);
    
    hueGradient.addColorStop(0, "rgba(" + v + ", 0, 0, 1)");
    
    hueGradient.addColorStop(1 / 6, "rgba(" + v + "," + v + ", 0, 1)");
    
    hueGradient.addColorStop(2 / 6, "rgba(0, " + v + ", 0, 1)");
    
    hueGradient.addColorStop(3 / 6, "rgba(0, " + v + "," + v + ", 1)");
    
    hueGradient.addColorStop(4 / 6, "rgba(0, 0, " + v + ", 1)");
    
    hueGradient.addColorStop(5 / 6, "rgba(" + v + ", 0," + v + ", 1)");
    
    hueGradient.addColorStop(1, "rgba(" + v + ", 0, 0, 1)");
    
    var saturationGradient = this.hueSaturationContext.createLinearGradient(0, 100, 0, 0);
    
    var v = Math.round(this.value * 255);
    
    saturationGradient.addColorStop(0, "rgba(" + v + "," + v + "," + v + ", 0)");
    
    saturationGradient.addColorStop(1, "rgba(" + v + "," + v + "," + v + ", 1)");
    
    this.hueSaturationContext.fillStyle = hueGradient;
    
    this.hueSaturationContext.fillRect(0, 0, 200, 100);
    
    this.hueSaturationContext.fillStyle = saturationGradient;
    
    this.hueSaturationContext.fillRect(0, 0, 200, 100);
    
  },
  
  downValue: function(e){
    
    var bounds = this.$["value"].getBoundingClientRect();
    
    var y = e.clientY - bounds.top;
    
    this.tracking = false;
    
    this.value = 1 - (y / 100);
    
  },
  
  trackValue: function(e){
    
    var bounds = this.$["value"].getBoundingClientRect();
    
    var y = e.clientY - bounds.top;
    
    this.tracking = true;
    
    this.value = 1 - (y / 100);
    
    if(this.value > 1){
      
      this.value = 1;
      
    }
    
    else if(this.value < 0){
      
      this.value = 0
      
    }
    
    
  },
  
  downHueSaturation: function(e){
    
    var bounds = this.$["hue-saturation"].getBoundingClientRect();
    
    var x = e.clientX - bounds.left;
    
    var y = e.clientY - bounds.top;
    
    this.tracking = false;
    
    this.hue = x / 200;
    
    this.saturation = y / 100;
    
  },
  
  trackHueSaturation: function(e){
    
    this.lockRGB = true;
    
    var bounds = this.$["hue-saturation"].getBoundingClientRect();
    
    var x = e.clientX - bounds.left;
    
    var y = e.clientY - bounds.top;
    
    this.tracking = true;
    
    this.hue = x / 200;
    
    if(this.hue > 1){
      
      this.hue = 1;
      
    }
    
    else if(this.hue < 0){
      
      this.hue = 0
      
    }
    
    this.saturation = y / 100;
    
    if(this.saturation > 1){
      
      this.saturation = 1;
      
    }
    
    else if(this.saturation < 0){
      
      this.saturation = 0
      
    }
    
  },
  
  RGBtoHSV: function(color){
    
    var r = color.r / 255;
    
    var g = color.g / 255;
    
    var b = color.b / 255;
    
    var max = Math.max(r, g, b);
    
    var min = Math.min(r, g, b);
    
    this.hue = max;
    
    this.saturation = max;
    
    this.value = max;
    
    var d = max - min;
    
    this.saturation = max == 0 ? 0 : d / max;
    
    if(max == min){
      
      this.hue = 0;
      
    }
    
    else{
      
      switch(max){
        
        case r:
          
          this.hue = (g - b) / d + (g < b ? 6 : 0);
          
          break;
        
        case g:
          
          this.hue = (b - r) / d + 2;
          
          break;
        
        case b:
          
          this.hue = (r - g) / d + 4;
        
      }
      
      this.hue = this.hue / 6;
      
    }
    
    console.log(this.hue, this.saturation, this.value);
    
  },
  
  HSVtoRGB: function(){
    
    if(this.saturation == 0){
      
      this.red = Math.round(this.value * 255);
      
      this.green = Math.round(this.value * 255);
      
      this.blue = Math.round(this.value * 255);
      
      var r = 255;
      
      var g = 255;
      
      var b = 255;
      
    }
    
    else{
      
      var h = this.hue * 6;
      
      if(h == 6){
        
        h = 0;
        
      }
      
      var i = Math.floor(h);
      
      var a = this.value * (1 - this.saturation);
      
      var aa = 1 - this.saturation
      
      var b = this.value * (1 - this.saturation * (h - i));
      
      var bb = 1 - this.saturation * (h - i);
      
      var c = this.value * (1 - this.saturation * (1 - (h - i)));
      
      var cc = 1 - this.saturation * (1 - (h - i));
      
      switch(i){
        
        case 0:
          
          this.red = this.value;
          
          this.green = c;
          
          this.blue = a;
          
          var r = 1;
          
          var g = cc;
          
          var b = aa;
          
          break;
        
        case 1:
          
          this.red = b;
          
          this.green = this.value;
          
          this.blue = a;
          
          var r = bb;
          
          var g = 1;
          
          var b = aa;
          
          break;
        
        case 2:
          
          this.red = a;
          
          this.green = this.value;
          
          this.blue = c;
          
          var r = aa;
          
          var g = 1;
          
          var b = cc;
          
          break;
        
        case 3:
          
          this.red = a;
          
          this.green = b;
          
          this.blue = this.value;
          
          var r = aa;
          
          var g = bb;
          
          var b = 1;
          
          break;
        
        case 4:
          
          this.red = c;
          
          this.green = a;
          
          this.blue = this.value;
          
          var r = cc;
          
          var g = aa;
          
          var b = 1;
          
          break;
        
        case 5:
          
          this.red = this.value;
          
          this.green = a;
          
          this.blue = b;
          
          var r = 1;
          
          var g = aa;
          
          var b = bb;
          
          break;
        
      }
      
      this.red = Math.round(this.red *255);
      
      this.green = Math.round(this.green *255);
      
      this.blue = Math.round(this.blue *255);
      
      r = Math.round(r * 255);
      
      g = Math.round(g * 255);
      
      b = Math.round(b * 255);
      
    }
    
    this.updateHueSaturationGradient();
    
    this.updateValueGradient(r, g, b);
    
    this.updateHex();
    
  },
  
  updateHex: function(){
    
    var colors = ["red", "green", "blue"];
    
    var hexValues = ["", "", ""];
    
    for(var i = 0; i != hexValues.length; i++){
      
      hexValues[i] = this[colors[i]].toString(16);
      
      if(hexValues[i].length == 1){
        
        hexValues[i] = "0" + hexValues[i];
        
      }
      
    }
    
    this.hex = "#" + hexValues[0] + 
                     hexValues[1] + 
                     hexValues[2];
    
  }
  
})