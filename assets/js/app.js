var data = [];

d3.csv("assets/data/data.csv").then(function(data) {
    console.log(data);
}).catch(function(error) {
    console.log(error);
});

