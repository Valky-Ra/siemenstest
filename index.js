//javascript

var model = {};
var formatTime = d3.timeFormat("%M:%S:%L");

function drawChart(data) {
    var svgWidth = 600, svgHeight = 400;
    var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;


    var convertedData = Object.values(data);

    var svg = d3.select('svg')
        .attr("viewBox", "0 0 600 400")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .classed("svg-content", true);

    d3.selectAll('svg > g > *').remove(); // очистить график

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var line = d3.line()
        .x(function (v) {
            return x(v.date)
        })
        .y(function (v) {
            return y(+v.value)
        });
    x.domain(d3.extent(convertedData, function (d) {
        return d.date
    }));
    y.domain(d3.extent(convertedData, function (d) {
        return d.value
    }));

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .select(".domain")
        .remove();

    g.append("g")
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end");

    g.append("path")
        .data([convertedData])
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);


    g.append("g")
        .selectAll("text")
        .data(convertedData)
        .enter() // добавляем элементы
        .append('text') // добавление на svg картину элемент
        .classed('label', true) // задаём класс
        .attr("x", function (d) { // положение x и y на графике в зависимости от значений.
            return x(d.date)
        })
        .attr("y", function (d) {
            return y(d.value)
        })
        .text(function (d) { // вывод самого значения на экран
            return d.value;
        });

}

function drawList(data) {
    var target = document.getElementById("valueslist");
    while (target.firstChild) {
        target.firstChild.remove();
    }
    Object.keys(data).forEach(function (key) {
        var node = document.createElement("li");                         // Create a <li> node
        var textnode = document.createTextNode(formatTime(data[key].date) + " " + data[key].value);  // Create a text node
        var button = document.createElement("button");                   // кнопка удаления значений
        var textremove = document.createTextNode("Remove");              // удаляем значения из графика

        button.addEventListener("click", function () {                     // навесить обработчик
            delete model[key];
            updateAll(model);
        });

        node.appendChild(textnode);
        button.appendChild(textremove);
        node.appendChild(button);
        target.appendChild(node);
    });
}

function updateAll(model) {
    drawChart(model);
    drawList(model);
    var modelString = JSON.stringify(model);
    localStorage.setItem('dataModel', modelString)
}

window.onload = function () {
    var localModel = localStorage.getItem('dataModel');
    if (localModel) {
        model = JSON.parse(localModel);
        Object.keys(model).forEach(function (key) {
            model[key] = {date: new Date(model[key].date), value: parseInt(model[key].value)};
        });
        updateAll(model);
    }
    var leftcollapse = document.getElementById("leftcollapse");
    var rightcollapse = document.getElementById("rightcollapse");
    var inputBox = document.getElementById("newvalue");
    leftcollapse.addEventListener("click", function () {
        leftcollapse.parentNode.classList.toggle("expanded");
        leftcollapse.classList.toggle("turnedleft");
    });
    rightcollapse.addEventListener("click", function () {
        rightcollapse.parentNode.classList.toggle("expanded");
        rightcollapse.classList.toggle("turnedleft");
    });
    inputBox.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            var dateKey = new Date();
            model[dateKey] = {date: dateKey, value: inputBox.value};
            inputBox.value = "";
            updateAll(model);
        }
    });
};