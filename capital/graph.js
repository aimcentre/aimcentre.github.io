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
  //var ctxL = document.getElementById(canvasId).getContext('2d');
  var myChart = new Chart(ctxL, {
      type: 'scatter',
      data: {
        datasets: [
            {
              label: 'Pledges',
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
            }
        ]
      },
      options: {
        responsive: true,
        legend:{
          display:false
        },
        elements: {
          line: {
              tension: 0.001
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
            }
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
              var d = new Date(tooltipItems.xLabel);

              var labelVals = [date2Str(d, true)];

              if(tooltipItems.index > 0){
                var prev = data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index - 1].y;
                var inc = (tooltipItems.yLabel - prev).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                labelVals.push("    Pledge: $" + inc);   
              }

              var total = tooltipItems.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              labelVals.push("    Total: $" + total);   

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
  //$("#amountPledged").html(dollars2str(totalPledged));
  //$("#donorCount").html(dpts.length);
}