var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseDate(val){
  return new Date(val);
}

function date2Str(d, forceFull){
  var str = "";

  if(forceFull || d.getMonth() == 0)
    str = str + d.getFullYear() + " ";

  str = str + MONTHS[d.getMonth()] + " " + ("0" + d.getDate()).slice(-2);

  return str;
}

function dollars2str(val){
  return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showGraph(panelId, dpts, target){

  //Formatting reference:
  //https://www.chartjs.org/docs/latest/charts/line.html

  var canvas = document.getElementById(panelId).getElementsByTagName('canvas')[0];
  var ctxL = canvas.getContext('2d');

  if(target != undefined){
    target = target + 1;
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    targetLinePts = [{x:dpts[0].x, y:target}, {x:tomorrow, y:target}];

    targetLine = {
              label: 'Final Amount Needed',
              borderWidth: 2,
              data: targetLinePts,
              backgroundColor: 'transparent',
              pointStyle: 'circle',
              pointBorderColor: 'transparent',
              pointBackgroundColor: 'red',
              pointRadius: 0,
              pointHoverBackgroundColor: 'purple',
              pointHoverBorderColor: 'purple',
              borderColor: 'orange'
    }
  }

  var myChart = new Chart(ctxL, {
      type: 'scatter',
      data: {
        datasets: [
            {
              label: 'Commitments Received',
              borderWidth: 2,
              data: dpts,
              backgroundColor: 'rgba(31, 222, 88, 0.25)',
              pointStyle: 'circle',
              pointBorderColor: 'red',
              pointBackgroundColor: 'red',
              pointRadius: 2,
              pointHoverBackgroundColor: 'purple',
              pointHoverBorderColor: 'purple',
              borderColor: 'green'
            },

            targetLine
        ]
      },
      options: {
        responsive: true,
        legend:{
          display:true
        },
        elements: {
          line: {
              tension: 0.01
          }
        },
        animation: {
          duration: 1000 // general animation time
        },
        scales: {
          xAxes: [{
            ticks: {
              //Custom date labels in the ticks
              callback: function(value, index, values) {
                return date2Str(new Date(value));
              }
            }
          }],
          yAxes: [{
            ticks: {
              // Include a dollar sign and commas in the ticks
              callback: function(value, index, values) {
                return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              } 
            },
            max: target + 10000
          }]
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          bodyFontSize: 12,
          backgroundColor: '#6A0000',
          callbacks: {
            //Custom tooltip labels
            label: function(tooltipItems, data) {
              if(target != undefined && target == tooltipItems.yLabel)
                return []; //No tooltip is shown for the target line.

              var d = new Date(tooltipItems.xLabel);

              var labelVals = [date2Str(d, true)];
              var prev = 0;

              if(tooltipItems.index > 0){
                prev = data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index - 1].y;
              }

              //var inc = (tooltipItems.yLabel - prev).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              //labelVals.push("    Pledge: $" + inc);   
              //var total = tooltipItems.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              //labelVals.push("    Total: $" + total); 

              var total = tooltipItems.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              labelVals.push("Total: $" + total);   

              return labelVals;
            }
          }
        }
      }
  });
  myChart.render();

  $(".infoPanel").show();

  var totalPledged = dpts[dpts.length - 1].y;
  $("#" + panelId + " .amountPledged").html(dollars2str(totalPledged));
  $("#" + panelId + " .donorCount").html(dpts.length);
} //END: showGraph(panelId, dpts, target)

function showDistributions(panelId, dpts){

  //Formatting reference:
  //https://www.chartjs.org/docs/latest/charts/line.html

  var canvas = document.getElementById(panelId).getElementsByTagName('canvas')[0];
  var ctx = canvas.getContext('2d');

  //var data = dpts.map(d => d.y);
  var exponent = 0.875;
  var pledges = dpts.map(d => Math.pow(d.p, exponent));
  var maxPledge = Math.max.apply(Math, pledges);

  //'#DC143C' #9e2ce0 #1f3691 blue #006666
  var colours = dpts.map(d => chroma.mix('#00b300', '#003300', 1 - d.p/maxPledge).hex());
  //var colours = dpts.map(d => chroma.mix('red', 'blue', 1 - d.p/maxPledge).hex());
  //var colours = [];

  new Chart(ctx, {
    data: {
      datasets: [{
        data: pledges,
        backgroundColor: colours,
        hoverBackgroundColor: '#c91e0e'
      }],
      labels: []
    },
    type: 'pie',
    options: {
      responsive: true,
      legend:{
        display:false
      },
      tooltips: {
          enabled: true,
          mode: 'single',
          bodyFontSize: 12,
          backgroundColor: '#6A0000',
          callbacks: {
            //Custom tooltip labels
            label: function(tooltipItems, data) {

              //if(target != undefined && target == tooltipItems.yLabel)
              //  return []; //No tooltip is shown for the target line.

              //Extracting pledge for pie charts
              var pledge = data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
              pledge = Math.round(Math.pow(pledge, (1/exponent)));

              //Extracting pledge for polarArea charts
              //var pledge = tooltipItems.yLabel;

              var pledgeStr = pledge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              var labelVals = ["$" + pledgeStr];

              return labelVals;
            }
          }
        }
    }
});

} //END: showDistributions(panelId, dpts)

function initialize(panelId, donorPanelId, isGadgetMode, target, polarPanelId){
  var spreadsheetId = "1VfuLJzB6ygO4SKC77yU9iO7UZWOC9zI4PmhJAXbQR8A",
  url = "https://spreadsheets.google.com/feeds/list/" +
        spreadsheetId +
        "/od6/public/basic?alt=json";

  $.get({
    url: url,
    success: function(response) {
      var data = response.feed.entry;
      var dpts = [];
      var donors = [];

      for (var i = 0; i < data.length; i++) {
        var cont = data[i].content.$t;
        //console.log(cont)

        //Collecting pledge data and donor names
        cont = cont.split(', '); //spliting data key-value pairs

        if(cont.length < 2)
          continue;

        var pledge = 0;
        var total = 0;
        var names = [];

        for(var k=0; k<cont.length; ++k){
          var n = cont[k].indexOf(': ');

          if(n < 0)
            continue;

          var key = cont[k].substring(0, n);
          var val = cont[k].substring(n+2);

          switch(key)
          {
            case 'pledge':
              val = val.replace('$', '').replace(',', '');
              pledge = Number(val);
            break;

            case 'totalamount':
              val = val.replace('$', '').replace(',', '');
              total = Number(val);
            break;

            case 'donor':
              names.push($.trim(val));
            break;

            case 'spouse':
              names.push($.trim(val));
            break;            
          }

        }

        if(pledge > 0){
          var d = new Date(data[i].title.$t);
          
          if(d < new Date("2000-01-01"))  //date is not specified
            d = new Date();       

          //NOTE: Due to some odd reason, the date-time value read from the
          //spreadsheet cell is always one day behind the actual date set
          //at the spreadsheet. Also, the vertical gridline has some offset than
          //the label. We calculate and add some offset in milliseconds, which was 
          //caluclated emperically to compensate for this lag. 
          var timeOffsetCompensation = 43200000; //add 12 hours
          d = new Date(d.getTime() + timeOffsetCompensation);

          //console.log(amount + " on " + d);

          dpts.push({x:d, y:total, p:pledge});  
        }

        //Removing the last name of the first entry in the name 
        //if both names have the same lastname
        if(names.length == 2){
          var name_0_parts = names[0].split(" ");
          var name_1_parts = names[1].split(" ");

          if(name_0_parts.length > 1 && name_0_parts[name_0_parts.length-1] == name_1_parts[name_1_parts.length-1]){
            name_0_parts.pop(); //remove the last entry
            names[0] = name_0_parts.join(" ");
          }
        }

        if(names.length > 0)
          donors.push('<div class="col-md-4">' + names.join(' &amp; ') + '</div>');
      } 

      showGraph(panelId, dpts, target);

      if(polarPanelId != undefined){
        showDistributions(polarPanelId, dpts);
      }

      //Displaying donors' names
      if(donorPanelId != undefined){
        $("#" + donorPanelId).html(donors.join(' '))

      }

      if(isGadgetMode){
        gadgets.window.adjustHeight();
      }

    } //END: success: function(response)
  }); //END: $.get 
}