function windGuage(windDIR,hourwindDiravg,daywindavg,currentwindSpeed,daywindrms) {
  var gauge = anychart.gauges.circular();
  gauge.fill('#fff')
          .stroke(null)
          .padding(-8)
          .margin(-4)
          .startAngle(0)
          .sweepAngle(360);

gauge.data([windDIR]);

  gauge.axis().labels()
          .enabled(true)
          .fontSize(8)
          .padding(5)
          .position("center-top")
      .anchor("left")
      .offsetY(-35)
          .format(function () {
              if (this.value == 0) return '';
              if (this.value == 22.5) return 'NNE';
              if (this.value == 45) return '';
              if (this.value == 67.5) return 'ENE';
              if (this.value == 90) return '';
              if (this.value == 112.5) return 'ESE';
              if (this.value == 135) return '';
              if (this.value == 157.5) return 'SSE';
              if (this.value == 180) return '';
              if (this.value == 202.5) return 'SSW';
              if (this.value == 225) return '';
              if (this.value == 247.5) return 'WSW';
              if (this.value == 270) return '';
              if (this.value == 292.5) return 'WNW';
              if (this.value == 315) return '';
              if (this.value == 337.5) return 'NNW';
              else return this.value;
          });
          /*.format('{%Value}\u00B0');*/


  gauge.axis().scale()
          .minimum(0)
          .maximum(360)
          .ticks({interval: 22.5})
          .minorTicks({interval: 10});

  gauge.axis()
          .fill('#7c868e')
          .startAngle(0)
          .sweepAngle(360)
          .width(1)
          .ticks(
                  {
                      type: 'line',
                      fill: '#ffffff',
                      length: 0,
                      position: 'inside'
                  }
          );

  gauge.axis(1).labels()
          .enabled(true)
          .fontSize(14)
          .padding(5)
          .position("center-top")
      .anchor("left")
      .offsetY(-25)
          .format(function () {
              if (this.value == 0) return 'N';
              if (this.value == 22.5) return '';
              if (this.value == 45) return 'NE';
              if (this.value == 67.5) return '';
              if (this.value == 90) return 'E';
              if (this.value == 112.5) return '';
              if (this.value == 135) return 'SE';
              if (this.value == 157.5) return '';
              if (this.value == 180) return 'S';
              if (this.value == 202.5) return '';
              if (this.value == 225) return 'SW';
              if (this.value == 247.5) return '';
              if (this.value == 270) return 'W';
              if (this.value == 292.5) return '';
              if (this.value == 315) return 'NW';
              if (this.value == 337.5) return '';
              else return this.value;
          });
          /*.format('{%Value}\u00B0');*/

  gauge.axis(1).scale()
          .minimum(0)
          .maximum(360)
          .ticks({interval: 22.5})
          .minorTicks({interval: 10});

    gauge.axis(1)
          .fill('#cccccc')
          .startAngle(0)
      .radius(92)
          .sweepAngle(360)
          .width(10)
          .ticks(
                  {
                      type: 'line',
                      fill: '#ffffff',
                      length: 11.25,
                      position: 'center'
                  }
          );

    gauge.axis(2).labels()
          .enabled(false);

    gauge.axis(2).scale()
          .minimum(0)
          .maximum(360)

    gauge.axis(2)
          .fill('#0099bc')
          .startAngle(hourwindDiravg-33.75)
          .sweepAngle(67.5)
      .radius(98.25)
          .width(2)
          .ticks(
                  {
                      enabled: false,
                  }
          );

  gauge.title()
          .padding(0)
          .margin([0, 0, 10, 0]);

  gauge.marker()
          .type('triangledown')
          .fill('#2d7d9a')
          .stroke(null)
          .size('10%')
          .zIndex(120)
          .radius('105');

  var bigTooltipTitleSettings = {
      fontFamily: "'Verdana', Helvetica, Arial, sans-serif",
      fontWeight: 'normal',
      fontSize: '14px',
      hAlign: 'center',
      fontColor: '#2d7d9a'
  };

  gauge.label()
          //.text('<span>AVG: ' + daywindavg + '</span><br /><span style="font-Size:14px; font-Weight:bold;">NOW: ' + currentwindSpeed + '</span><br /><span>RMS: ' + daywindrms + '</span>').useHtml(true)
          //.text('<span width="200px" style="font-Size:18px; font-Weight:bold; width:200px; text-align:center;">' + currentwindSpeed + '</span>').useHtml(true)
          .text('<span style="font-Size:18px; font-Weight:bold;">' + currentwindSpeed + '</span><br /><span style="font-Size:10px;">&nbsp;&nbsp;&nbsp;&nbsp;AVG: ' + daywindavg + '&nbsp;&nbsp;&nbsp;&nbsp;</span>').useHtml(true)
          .textSettings(bigTooltipTitleSettings)
          .hAlign('center')
          .anchor('center')
          .padding(15, 20)
          .background(
                  {
                      fill: '#fff',
                      stroke: {
                          thickness: 1,
                          color: '#cccccc'
                      }
                  }
          );

  gauge.label(1)
          //.text('<span style="color:#cccccc;">$unit.label.windSpeed</span>').useHtml(true)
          .text('<span style="color:#cccccc;">MPH</span>').useHtml(true)
          .textSettings(bigTooltipTitleSettings)
          .offsetY(-55)
          .hAlign('center')
          .anchor('center');

  // set container id for the chart
  gauge.container('wind-gauge');
  gauge.contextMenu(false);

  var credits = gauge.credits();
  credits.enabled(false);
  credits.text("Griffin Park");

  // initiate chart drawing
  gauge.draw();
}
var ndtid = setInterval(newDataCheck, 5000);
var ldtid = setInterval(newLiveDataCheck, 1500);
function newDataCheck() {
  $.getJSON("current.json", function(json) {
      //console.log(json); // this will show the info it in firebug console
      if (json["last-updated"] > currentDataStamp) {
        currentDataStamp = json["last-updated"];
        //reload page
        //location.reload(true);
        //update info without reloading page
        var images = document.images;
        for (var i=0; i<images.length; i++) {
            images[i].src = images[i].src.replace(/\btime=[^&]*/, 'time=' + new Date().getTime());
        }
        //let varsToUpdate = ['current.dateTime','almanac.sun.rise','almanac.moon.rise','almanac.sun.set','almanac.moon.set','almanac.moon_phase','almanac.moon_fullness','current.windSpeed','current.windDir','hour.windDir.avg','day.wind.avg','day.wind.rms','day.wind.max','day.wind.maxtime','current.outTemp','day.outTemp.max','day.outTemp.maxtime','day.outTemp.min','day.outTemp.mintime','current.outHumidity','day.outHumidity.max','day.outHumidity.maxtime','day.outHumidity.min','day.outHumidity.mintime','current.barometer','day.barometer.max','day.barometer.maxtime','day.barometer.min','day.barometer.mintime','day.rain.sum','current.rainRate','day.rainRate.max','day.rainRate.maxtime','aqi_pm2_5','aqi_pm2_5.max','aqi_pm2_5.maxtime','aqi_pm2_5.min','aqi_pm2_5.mintime','current.dewpoint','day.dewpoint.max','day.dewpoint.maxtime','day.dewpoint.min','day.dewpoint.mintime','current.windchill','day.windchill.min','day.windchill.mintime','current.heatindex','day.heatindex.max','day.heatindex.maxtime','current.radiation','day.radiation.max','day.radiation.maxtime','current.UV','day.UV.max','day.UV.maxtime'];
        let varsToUpdate = ['current.dateTime','almanac.sun.rise','almanac.moon.rise','almanac.sun.set','almanac.moon.set','almanac.moon_phase','almanac.moon_fullness','day.wind.max','day.wind.maxtime','day.outTemp.max','day.outTemp.maxtime','day.outTemp.min','day.outTemp.mintime','day.outHumidity.max','day.outHumidity.maxtime','day.outHumidity.min','day.outHumidity.mintime','current.barometer','day.barometer.max','day.barometer.maxtime','day.barometer.min','day.barometer.mintime','day.rain.sum','current.rainRate','day.rainRate.max','day.rainRate.maxtime','aqi_pm2_5','aqi_pm2_5.max','aqi_pm2_5.maxtime','aqi_pm2_5.min','aqi_pm2_5.mintime','day.dewpoint.max','day.dewpoint.maxtime','day.dewpoint.min','day.dewpoint.mintime','day.windchill.min','day.windchill.mintime','day.heatindex.max','day.heatindex.maxtime','current.radiation','day.radiation.max','day.radiation.maxtime','current.UV','day.UV.max','day.UV.maxtime'];
        //let varsToUpdate = ['current.dateTime','almanac.sun.rise','almanac.moon.rise','almanac.sun.set','almanac.moon.set','almanac.moon_phase','almanac.moon_fullness','day.wind.max','day.wind.maxtime','current.outTemp','day.outTemp.max','day.outTemp.maxtime','day.outTemp.min','day.outTemp.mintime','current.outHumidity','day.outHumidity.max','day.outHumidity.maxtime','day.outHumidity.min','day.outHumidity.mintime','current.barometer','day.barometer.max','day.barometer.maxtime','day.barometer.min','day.barometer.mintime','day.rain.sum','current.rainRate','day.rainRate.max','day.rainRate.maxtime','aqi_pm2_5','aqi_pm2_5.max','aqi_pm2_5.maxtime','aqi_pm2_5.min','aqi_pm2_5.mintime','current.dewpoint','day.dewpoint.max','day.dewpoint.maxtime','day.dewpoint.min','day.dewpoint.mintime','current.windchill','day.windchill.min','day.windchill.mintime','current.heatindex','day.heatindex.max','day.heatindex.maxtime','current.radiation','day.radiation.max','day.radiation.maxtime','current.UV','day.UV.max','day.UV.maxtime'];
        for (var i=0; i<varsToUpdate.length; i++) {
          document.getElementById(varsToUpdate[i]).innerHTML = json[varsToUpdate[i]];
        }
        if (currentDataStamp >= liveDataStamp ) {
          currentwindSpeed = livejson["current.windSpeed"].toFixed(1);
          currentwindDir = json["current.windDir"];
          hourwindDiravg = json["hour.windDir.avg"];
          daywindavg = json["day.wind.avg"];
          daywindrms = json["day.wind.rms"];
          document.getElementById("wind-gauge").innerHTML = "";
          windGuage(currentwindDir,hourwindDiravg,daywindavg,currentwindSpeed,daywindrms);
        } else {
          //currentwindSpeed = livejson["current.windSpeed"].toFixed(1);
          //currentwindDir = json["current.windDir"];
          hourwindDiravg = json["hour.windDir.avg"];
          daywindavg = json["day.wind.avg"];
          daywindrms = json["day.wind.rms"];
          //document.getElementById("wind-gauge").innerHTML = "";
          //windGuage(currentwindDir,hourwindDiravg,daywindavg,currentwindSpeed,daywindrms);
        }
      }
  });
}
function newLiveDataCheck() {
  $.getJSON("live.php", function(livejson) {
      //console.log(livejson); // this will show the info it in firebug console
      if (livejson["last-updated"] > liveDataStamp) {
        liveDataStamp = livejson["last-updated"];
        //reload page
        //location.reload(true);
        //update info without reloading page
        var images = document.images;
        for (var i=0; i<images.length; i++) {
            images[i].src = images[i].src.replace(/\btime=[^&]*/, 'time=' + new Date().getTime());
        }
        //let varsToUpdate = ['current.dateTime','almanac.sun.rise','almanac.moon.rise','almanac.sun.set','almanac.moon.set','almanac.moon_phase','almanac.moon_fullness','current.windSpeed','current.windDir','hour.windDir.avg','day.wind.avg','day.wind.rms','day.wind.max','day.wind.maxtime','current.outTemp','day.outTemp.max','day.outTemp.maxtime','day.outTemp.min','day.outTemp.mintime','current.outHumidity','day.outHumidity.max','day.outHumidity.maxtime','day.outHumidity.min','day.outHumidity.mintime','current.barometer','day.barometer.max','day.barometer.maxtime','day.barometer.min','day.barometer.mintime','day.rain.sum','current.rainRate','day.rainRate.max','day.rainRate.maxtime','aqi_pm2_5','aqi_pm2_5.max','aqi_pm2_5.maxtime','aqi_pm2_5.min','aqi_pm2_5.mintime','current.dewpoint','day.dewpoint.max','day.dewpoint.maxtime','day.dewpoint.min','day.dewpoint.mintime','current.windchill','day.windchill.min','day.windchill.mintime','current.heatindex','day.heatindex.max','day.heatindex.maxtime','current.radiation','day.radiation.max','day.radiation.maxtime','current.UV','day.UV.max','day.UV.maxtime'];
        let varsToUpdate = ['current.outTemp','current.outHumidity'];
        livejson["current.outTemp"] = livejson["current.outTemp"].toFixed(1) + "&deg;F";
        livejson["current.outHumidity"] = Math.round(livejson["current.outHumidity"]) + "%";
        for (var i=0; i<varsToUpdate.length; i++) {
          document.getElementById(varsToUpdate[i]).innerHTML = livejson[varsToUpdate[i]];
        }
        currentwindSpeed = livejson["current.windSpeed"].toFixed(1);
        currentwindDir = livejson["current.windDir"];
        //hourwindDiravg = livejson["hour.windDir.avg"];
        //daywindavg = livejson["day.wind.avg"];
        //daywindrms = livejson["day.wind.rms"];
        document.getElementById("wind-gauge").innerHTML = "";
        windGuage(currentwindDir,hourwindDiravg,daywindavg,currentwindSpeed,daywindrms);
      }
  });
}
function abortTimer() { // to be called when you want to stop the timer
  clearInterval(ndtid);
  clearInterval(ldtid);
}
anychart.onDocumentReady(function(){
  windGuage(currentwindDir,hourwindDiravg,daywindavg,currentwindSpeed,daywindrms);
});
