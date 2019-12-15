const blueColor = '#2c3e50';
const fontFamily =
  "'Open Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";

export default () => {
  return {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [
        {
          label: `Number of Card Types`,
          data: [],
          borderWidth: 3,
          hoverBorderColor: 'white',
          backgroundColor: [],
        },
      ],
    },
    options: {
      title: {
        display: true,
        fontSize: 20,
        fontColor: blueColor,
        fontStyle: 'bold',
        fontFamily: `'Gill Sans', ${fontFamily}`,
        padding: 30,
      },
      tooltips: {
        cornerRadius: 3,
        caretSize: 15,
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 1,
        xPadding: 10,
        yPadding: 10,
        displayColors: false,
        bodyFontColor: blueColor,
        bodyFontSize: 14,
        bodyFontStyle: 'bold',
        bodyFontFamily: fontFamily,
      },
      layout: {
        padding: {
          top: 0,
          right: 15,
          bottom: 30,
          left: 15,
        },
      },
      legend: {
        position: 'left',
        labels: {
          fontSize: 14,
          fontColor: blueColor,
          fontFamily,
        },
      },
      scales: {
        axes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        ],
      },
    },
  };
};
