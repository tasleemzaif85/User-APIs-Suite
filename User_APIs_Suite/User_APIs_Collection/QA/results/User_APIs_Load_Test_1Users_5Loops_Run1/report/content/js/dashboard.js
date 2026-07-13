/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9722222222222222, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8, 500, 1500, "Get User By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Post"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quote By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Product"], "isController": false}, {"data": [0.8, 500, 1500, "Get Recipes - Paginated"], "isController": false}, {"data": [0.8, 500, 1500, "Update User (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Login (alias: /user/login)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Users"], "isController": false}, {"data": [1.0, 500, 1500, "Delete User"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Quote"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Generate 2FA TOTP Code"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Categories"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Quotes"], "isController": false}, {"data": [1.0, 500, 1500, "Update Product (PUT)"], "isController": false}, {"data": [0.8, 500, 1500, "Get Todo By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Caller IP Address"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Meal Type"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products By Category"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New User"], "isController": false}, {"data": [0.8, 500, 1500, "Test Route - PUT"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Filter Users"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (alias: /user/me)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Square Image"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (me)"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Background Color"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image - Custom Format"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Search Products"], "isController": false}, {"data": [1.0, 500, 1500, "Create Custom Mock Response"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Todo"], "isController": false}, {"data": [0.8, 500, 1500, "Get Quotes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tags"], "isController": false}, {"data": [0.8, 500, 1500, "Search Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments For Post"], "isController": false}, {"data": [1.0, 500, 1500, "Search Users"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Cart By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comment By Id"], "isController": false}, {"data": [0.8, 500, 1500, "Add New Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tag List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Login (get access + refresh token)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Cart"], "isController": false}, {"data": [0.8, 500, 1500, "Mock 200 OK - DELETE"], "isController": false}, {"data": [0.8, 500, 1500, "Generate Image With Text + Colors"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 201 Created - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Refresh Token"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments By Post Id"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PUT"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Identicon"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Category List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Products"], "isController": false}, {"data": [1.0, 500, 1500, "Update Product (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments - Paginated"], "isController": false}, {"data": [0.0, 500, 1500, "Get Products - Simulate Delay (perf testing)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Sized Image"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Search Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos - Paginated"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 540, 0, 0.0, 197.6722222222221, 8, 4663, 127.0, 144.90000000000003, 218.84999999999843, 2724.580000000008, 0.835645543920137, 5.368022190451357, 0.47184141701111254], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get User By Id", 5, 0, 0.0, 588.0, 124, 2378, 125.0, 2378.0, 2378.0, 2378.0, 0.00965500727987549, 0.023471850705587934, 0.0050820790272000866], "isController": false}, {"data": ["Add New Post", 5, 0, 0.0, 125.4, 123, 131, 124.0, 131.0, 131.0, 131.0, 0.009713641838598127, 0.01103409002603256, 0.006687614742394219], "isController": false}, {"data": ["Delete Recipe", 5, 0, 0.0, 124.8, 123, 131, 123.0, 131.0, 131.0, 131.0, 0.009654932705119046, 0.017795624987931333, 0.005308327258771507], "isController": false}, {"data": ["Get Quote By Id", 5, 0, 0.0, 167.6, 123, 254, 132.0, 254.0, 254.0, 254.0, 0.00966344165407198, 0.010912894461688319, 0.005095955559764521], "isController": false}, {"data": ["Add New Product", 5, 0, 0.0, 127.4, 124, 133, 124.0, 133.0, 133.0, 133.0, 0.009704290849241902, 0.011527636122087742, 0.01102157251725423], "isController": false}, {"data": ["Get Recipes - Paginated", 5, 0, 0.0, 718.0, 126, 3081, 128.0, 3081.0, 3081.0, 3081.0, 0.009654858131514616, 0.091319495065402, 0.005232857678701769], "isController": false}, {"data": ["Update User (PUT)", 5, 0, 0.0, 668.2, 125, 2832, 125.0, 2832.0, 2832.0, 2832.0, 0.009656461717923165, 0.023426349804360085, 0.005526061100295874], "isController": false}, {"data": ["Update User (PATCH)", 5, 0, 0.0, 127.2, 125, 134, 125.0, 134.0, 134.0, 134.0, 0.009656480367409764, 0.02341507885964692, 0.00571467490493195], "isController": false}, {"data": ["Login (alias: /user/login)", 5, 0, 0.0, 128.6, 124, 133, 128.0, 133.0, 133.0, 133.0, 0.009658121804368949, 0.027391716156492482, 0.006111780204327225], "isController": false}, {"data": ["Get All Posts", 5, 0, 0.0, 11.8, 10, 13, 12.0, 13.0, 13.0, 13.0, 0.009658644196796807, 0.14825452905899691, 0.005065128841484263], "isController": false}, {"data": ["Get Recipes - Sorted", 5, 0, 0.0, 127.4, 126, 129, 127.0, 129.0, 129.0, 129.0, 0.00965489541817283, 0.2712271323802021, 0.005289449540620076], "isController": false}, {"data": ["Update Todo (PUT)", 5, 0, 0.0, 128.8, 124, 132, 131.0, 132.0, 132.0, 132.0, 0.009665309657190797, 0.010711126366191521, 0.005531124471790828], "isController": false}, {"data": ["Update Recipe (PUT)", 5, 0, 0.0, 149.4, 124, 241, 125.0, 241.0, 241.0, 241.0, 0.009654876774807723, 0.017201520691366413, 0.006213441205662392], "isController": false}, {"data": ["Get All Users", 5, 0, 0.0, 10.4, 9, 12, 11.0, 12.0, 12.0, 12.0, 0.009657077189017971, 0.40550670684010776, 0.005064307080568995], "isController": false}, {"data": ["Delete User", 5, 0, 0.0, 127.0, 125, 133, 126.0, 133.0, 133.0, 133.0, 0.0096564990169684, 0.023952644045995838, 0.005290328074725853], "isController": false}, {"data": ["Get Random Quote", 5, 0, 0.0, 128.0, 123, 131, 131.0, 131.0, 131.0, 131.0, 0.009663254893472278, 0.01146001635022728, 0.0051430409345140544], "isController": false}, {"data": ["Update Comment (PUT)", 5, 0, 0.0, 128.4, 125, 133, 126.0, 133.0, 133.0, 133.0, 0.009712207856787667, 0.011244915659186972, 0.005861469194819119], "isController": false}, {"data": ["Generate 2FA TOTP Code", 5, 0, 0.0, 130.8, 126, 134, 133.0, 134.0, 134.0, 134.0, 0.009663086815104565, 0.010255705811187149, 0.0052467541691388064], "isController": false}, {"data": ["Get Product Categories", 5, 0, 0.0, 127.8, 125, 132, 125.0, 132.0, 132.0, 132.0, 0.00970466755690817, 0.033899995948301294, 0.0052219451404847675], "isController": false}, {"data": ["Get All Todos", 5, 0, 0.0, 130.8, 125, 135, 132.0, 135.0, 135.0, 135.0, 0.009711887155640761, 0.03347755789255934, 0.005093050197831141], "isController": false}, {"data": ["Get All Quotes", 5, 0, 0.0, 129.8, 125, 133, 132.0, 133.0, 133.0, 133.0, 0.009664879952526111, 0.04666702386452158, 0.005077837318807663], "isController": false}, {"data": ["Update Product (PUT)", 5, 0, 0.0, 210.6, 127, 490, 128.0, 490.0, 490.0, 490.0, 0.009703255053940395, 0.014986980657531374, 0.005647597668113745], "isController": false}, {"data": ["Get Todo By Id", 5, 0, 0.0, 616.2, 123, 2570, 132.0, 2570.0, 2570.0, 2570.0, 0.009665907570725446, 0.0107382191918528, 0.00508781658263771], "isController": false}, {"data": ["Get Caller IP Address", 5, 0, 0.0, 127.2, 123, 133, 125.0, 133.0, 133.0, 133.0, 0.00965752485364021, 0.010559145338023027, 0.005036248312347532], "isController": false}, {"data": ["Get Products - Field Selection", 5, 0, 0.0, 130.4, 127, 137, 128.0, 137.0, 137.0, 137.0, 0.00965750620011898, 0.031070008228195285, 0.005356897970378497], "isController": false}, {"data": ["Get Recipes By Meal Type", 5, 0, 0.0, 128.6, 126, 135, 127.0, 135.0, 135.0, 135.0, 0.00965489541817283, 0.23652985197114346, 0.00524230649658603], "isController": false}, {"data": ["Get All Recipes", 5, 0, 0.0, 127.4, 127, 128, 127.0, 128.0, 128.0, 128.0, 0.009710189678845186, 0.26989017047209, 0.005111125231345269], "isController": false}, {"data": ["Get Products By Category", 5, 0, 0.0, 129.8, 126, 135, 127.0, 135.0, 135.0, 135.0, 0.00970438502341668, 0.08035875231206974, 0.005269177805683276], "isController": false}, {"data": ["Mock 200 OK - PATCH", 5, 0, 0.0, 129.2, 124, 134, 132.0, 134.0, 134.0, 134.0, 0.00966392726541783, 0.010133911228130532, 0.005586957950319682], "isController": false}, {"data": ["Get Posts - Sorted", 5, 0, 0.0, 129.4, 127, 137, 128.0, 137.0, 137.0, 137.0, 0.009656554966076522, 0.1282963857446073, 0.005280928497073098], "isController": false}, {"data": ["Get Product By Id", 5, 0, 0.0, 10.4, 8, 12, 11.0, 12.0, 12.0, 12.0, 0.009707003797379887, 0.024678919615330853, 0.005137886775566307], "isController": false}, {"data": ["Add New User", 5, 0, 0.0, 125.8, 123, 132, 125.0, 132.0, 132.0, 132.0, 0.009656424419166072, 0.017153355486780358, 0.005969254548175902], "isController": false}, {"data": ["Test Route - PUT", 5, 0, 0.0, 547.2, 124, 2223, 130.0, 2223.0, 2223.0, 2223.0, 0.009657767355973715, 0.010153859702579397, 0.005564533925805169], "isController": false}, {"data": ["Get User's Todos", 5, 0, 0.0, 126.0, 123, 134, 124.0, 134.0, 134.0, 134.0, 0.009656387120697113, 0.011566918400631914, 0.005139385723417897], "isController": false}, {"data": ["Get User's Posts", 5, 0, 0.0, 125.8, 123, 132, 125.0, 132.0, 132.0, 132.0, 0.009656368471570686, 0.015502997819592, 0.005139375797857445], "isController": false}, {"data": ["Filter Users", 5, 0, 0.0, 131.8, 126, 147, 128.0, 147.0, 147.0, 147.0, 0.009656219281152411, 0.3110415336924803, 0.00538447383743948], "isController": false}, {"data": ["Get All Carts", 5, 0, 0.0, 128.0, 126, 133, 127.0, 133.0, 133.0, 133.0, 0.009710095391977131, 0.2952267264792359, 0.005092110571769257], "isController": false}, {"data": ["Get Posts - Field Selection", 5, 0, 0.0, 127.2, 125, 134, 126.0, 134.0, 134.0, 134.0, 0.009656592265842123, 0.04186283631496714, 0.005346960756574691], "isController": false}, {"data": ["Update Post (PUT)", 5, 0, 0.0, 125.4, 123, 132, 124.0, 132.0, 132.0, 132.0, 0.009713660709602341, 0.014139826810286377, 0.0058433740206201585], "isController": false}, {"data": ["Get Posts - Paginated", 5, 0, 0.0, 127.8, 125, 134, 126.0, 134.0, 134.0, 134.0, 0.009656573615923304, 0.057737634395363294, 0.0052149269625054555], "isController": false}, {"data": ["Get Recipe By Id", 5, 0, 0.0, 125.0, 123, 132, 123.0, 132.0, 132.0, 132.0, 0.00965500727987549, 0.017256439769168085, 0.005100936463293593], "isController": false}, {"data": ["Get Products - Paginated", 5, 0, 0.0, 131.2, 126, 136, 130.0, 136.0, 136.0, 136.0, 0.009657692738573984, 0.15630749345208433, 0.005243825354147593], "isController": false}, {"data": ["Get Posts By User Id", 5, 0, 0.0, 124.8, 122, 132, 123.0, 132.0, 132.0, 132.0, 0.009713528614112591, 0.015659270543141666, 0.005160312076247314], "isController": false}, {"data": ["Get Carts - Paginated", 5, 0, 0.0, 127.2, 125, 133, 126.0, 133.0, 133.0, 133.0, 0.009710114249204257, 0.10786950747387493, 0.005243840995908158], "isController": false}, {"data": ["Get Recipe Tags", 5, 0, 0.0, 125.6, 124, 132, 124.0, 132.0, 132.0, 132.0, 0.00965500727987549, 0.01898378091533331, 0.005129222617433853], "isController": false}, {"data": ["Get Authenticated User (alias: /user/me)", 5, 0, 0.0, 128.0, 123, 133, 126.0, 133.0, 133.0, 133.0, 0.009658028525953054, 0.02345090051457976, 0.00508366931200068], "isController": false}, {"data": ["Get Products - Sorted", 5, 0, 0.0, 132.6, 129, 137, 132.0, 137.0, 137.0, 137.0, 0.009657580814636257, 0.4020590475355786, 0.005309783201797083], "isController": false}, {"data": ["Generate Square Image", 5, 0, 0.0, 142.2, 137, 146, 145.0, 146.0, 146.0, 146.0, 0.009662582615081359, 0.0303012551694817, 0.00510493866675685], "isController": false}, {"data": ["Get Authenticated User (me)", 5, 0, 0.0, 128.2, 124, 133, 127.0, 133.0, 133.0, 133.0, 0.009658308366606206, 0.023489307769722752, 0.005083816610938228], "isController": false}, {"data": ["Delete Product", 5, 0, 0.0, 126.6, 124, 132, 126.0, 132.0, 132.0, 132.0, 0.009710114249204257, 0.02493716645757554, 0.005348148863819531], "isController": false}, {"data": ["Get Random Todo", 5, 0, 0.0, 128.2, 124, 131, 131.0, 131.0, 131.0, 131.0, 0.009665776770818632, 0.010592709660363936, 0.005134943909497399], "isController": false}, {"data": ["Delete Cart", 5, 0, 0.0, 125.0, 124, 126, 125.0, 126.0, 126.0, 126.0, 0.009710227394105115, 0.02017906630337469, 0.00531976325009079], "isController": false}, {"data": ["Test Route - PATCH", 5, 0, 0.0, 128.0, 124, 131, 130.0, 131.0, 131.0, 131.0, 0.009657655430306496, 0.010159400810084136, 0.005583332045645942], "isController": false}, {"data": ["Get All Comments", 5, 0, 0.0, 128.8, 125, 134, 126.0, 134.0, 134.0, 134.0, 0.009712905926620939, 0.048799764073515044, 0.0051220402347415105], "isController": false}, {"data": ["Add New Cart", 5, 0, 0.0, 152.4, 124, 263, 125.0, 263.0, 263.0, 263.0, 0.009710189678845186, 0.015509752186249207, 0.006874890153479258], "isController": false}, {"data": ["Generate Image With Background Color", 5, 0, 0.0, 148.2, 142, 152, 151.0, 152.0, 152.0, 152.0, 0.009662246510962784, 0.06886615228086992, 0.005208554759815877], "isController": false}, {"data": ["Get User's Carts", 5, 0, 0.0, 126.8, 124, 133, 125.0, 133.0, 133.0, 133.0, 0.009656331173533927, 0.019914297043231395, 0.005139355946851554], "isController": false}, {"data": ["Generate Image - Custom Format", 5, 0, 0.0, 157.4, 151, 162, 159.0, 162.0, 162.0, 162.0, 0.009664039336505715, 0.024609325169797174, 0.00539827197312624], "isController": false}, {"data": ["Test Route - POST", 5, 0, 0.0, 127.4, 124, 131, 126.0, 131.0, 131.0, 131.0, 0.009657823319780188, 0.010119965255980606, 0.005498545893976415], "isController": false}, {"data": ["Test Route - DELETE", 5, 0, 0.0, 127.2, 124, 132, 124.0, 132.0, 132.0, 132.0, 0.009657636776280844, 0.010172584987203631, 0.005262657540199913], "isController": false}, {"data": ["Get Post By Id", 5, 0, 0.0, 125.2, 122, 131, 124.0, 131.0, 131.0, 131.0, 0.009656629565895873, 0.01411339043781227, 0.005082932945329958], "isController": false}, {"data": ["Test Route - GET", 5, 0, 0.0, 126.8, 123, 131, 125.0, 131.0, 131.0, 131.0, 0.009657935249338914, 0.010106878333194904, 0.005055325482075839], "isController": false}, {"data": ["Search Products", 5, 0, 0.0, 131.6, 128, 135, 131.0, 135.0, 135.0, 135.0, 0.009704686393059209, 0.36346135533223994, 0.005259864207175645], "isController": false}, {"data": ["Create Custom Mock Response", 5, 0, 0.0, 225.8, 220, 231, 227.0, 231.0, 231.0, 231.0, 0.009661126332752379, 0.010338537339287163, 0.006160854975866506], "isController": false}, {"data": ["Delete Todo", 5, 0, 0.0, 127.6, 123, 131, 130.0, 131.0, 131.0, 131.0, 0.009665029410684495, 0.011296003123737507, 0.005295001464251956], "isController": false}, {"data": ["Get Quotes - Paginated", 5, 0, 0.0, 669.8, 125, 2833, 132.0, 2833.0, 2833.0, 2833.0, 0.009664786543524399, 0.022521595361482346, 0.005228800532336443], "isController": false}, {"data": ["Mock 200 OK - GET", 5, 0, 0.0, 128.2, 123, 131, 131.0, 131.0, 131.0, 131.0, 0.009664356885371062, 0.010115486044668658, 0.005096438201269897], "isController": false}, {"data": ["Get Post Tags", 5, 0, 0.0, 127.8, 126, 134, 126.0, 134.0, 134.0, 134.0, 0.009713547484676878, 0.1441190692721639, 0.005141350328803583], "isController": false}, {"data": ["Search Posts", 5, 0, 0.0, 731.6, 123, 3156, 124.0, 3156.0, 3156.0, 3156.0, 0.009656648216030808, 0.014662262349887403, 0.005205536928954107], "isController": false}, {"data": ["Get Comments For Post", 5, 0, 0.0, 125.6, 124, 131, 124.0, 131.0, 131.0, 131.0, 0.009713547484676878, 0.014198474487367531, 0.005198265646096611], "isController": false}, {"data": ["Search Users", 5, 0, 0.0, 125.4, 123, 132, 124.0, 132.0, 132.0, 132.0, 0.009656237929702587, 0.010261638784279645, 0.005205315758980302], "isController": false}, {"data": ["Update Comment (PATCH)", 5, 0, 0.0, 128.8, 124, 132, 131.0, 132.0, 132.0, 132.0, 0.009712113530722329, 0.011184105737722431, 0.005548424233859924], "isController": false}, {"data": ["Get Cart By Id", 5, 0, 0.0, 125.4, 123, 132, 124.0, 132.0, 132.0, 132.0, 0.009710151963878234, 0.01947340632130893, 0.005111105379424189], "isController": false}, {"data": ["Get Comment By Id", 5, 0, 0.0, 127.0, 123, 132, 124.0, 132.0, 132.0, 132.0, 0.009712660647407109, 0.011161971728387387, 0.005140880928608059], "isController": false}, {"data": ["Add New Recipe", 5, 0, 0.0, 593.8, 124, 2454, 132.0, 2454.0, 2454.0, 2454.0, 0.009654820845144397, 0.0128661802004727, 0.009701963525052329], "isController": false}, {"data": ["Add New Comment", 5, 0, 0.0, 127.6, 124, 133, 125.0, 133.0, 133.0, 133.0, 0.009712377648322574, 0.011121810576585012, 0.0061650834681735095], "isController": false}, {"data": ["Get Post Tag List", 5, 0, 0.0, 127.2, 125, 135, 125.0, 135.0, 135.0, 135.0, 0.009713585226025414, 0.025761869879726385, 0.005179313997470582], "isController": false}, {"data": ["Get Carts By User Id", 5, 0, 0.0, 126.8, 124, 132, 125.0, 132.0, 132.0, 132.0, 0.009710170821325088, 0.020074640262446496, 0.005158528248828954], "isController": false}, {"data": ["Login (get access + refresh token)", 5, 0, 0.0, 198.4, 124, 478, 131.0, 478.0, 478.0, 478.0, 0.009651391730687565, 0.02739901929795777, 0.0024882494305678883], "isController": false}, {"data": ["Update Cart", 5, 0, 0.0, 127.2, 125, 134, 126.0, 134.0, 134.0, 134.0, 0.009710208536438529, 0.02188021013376783, 0.006286980722322992], "isController": false}, {"data": ["Mock 200 OK - DELETE", 5, 0, 0.0, 581.0, 125, 2374, 134.0, 2374.0, 2374.0, 2374.0, 0.009663777841343962, 0.01011676742765696, 0.005303753073081354], "isController": false}, {"data": ["Generate Image With Text + Colors", 5, 0, 0.0, 580.2, 149, 2186, 151.0, 2186.0, 2186.0, 2186.0, 0.0096621158101201, 0.060307077137501566, 0.005434940143192556], "isController": false}, {"data": ["Update Todo (PATCH)", 5, 0, 0.0, 129.2, 124, 135, 131.0, 135.0, 135.0, 135.0, 0.009665122824380852, 0.010720357913995872, 0.005559333343320628], "isController": false}, {"data": ["Mock 201 Created - POST", 5, 0, 0.0, 129.0, 124, 132, 132.0, 132.0, 132.0, 132.0, 0.009664207448011396, 0.010209706657479226, 0.005577682228295639], "isController": false}, {"data": ["Refresh Token", 5, 0, 0.0, 128.0, 125, 132, 126.0, 132.0, 132.0, 132.0, 0.009658252397178246, 0.025758483688177528, 0.009233817477380373], "isController": false}, {"data": ["Get Posts By Tag", 5, 0, 0.0, 128.8, 127, 135, 127.0, 135.0, 135.0, 135.0, 0.009713566355314486, 0.13922651963888846, 0.005207761649480129], "isController": false}, {"data": ["Get Recipes By Tag", 5, 0, 0.0, 126.8, 124, 133, 125.0, 133.0, 133.0, 133.0, 0.009654951348700154, 0.017661772330454226, 0.005176336221129282], "isController": false}, {"data": ["Update Recipe (PATCH)", 5, 0, 0.0, 125.4, 123, 132, 124.0, 132.0, 132.0, 132.0, 0.009654914061609936, 0.01723364445489321, 0.005525175429788499], "isController": false}, {"data": ["Get Users - Sorted", 5, 0, 0.0, 132.6, 128, 139, 129.0, 139.0, 139.0, 139.0, 0.009654932705119046, 0.4040099047540889, 0.005317755903991349], "isController": false}, {"data": ["Get Comments By Post Id", 5, 0, 0.0, 126.6, 122, 132, 124.0, 132.0, 132.0, 132.0, 0.009712509712509712, 0.014174193861693864, 0.005188225403069154], "isController": false}, {"data": ["Mock 200 OK - PUT", 5, 0, 0.0, 128.6, 124, 132, 131.0, 132.0, 132.0, 132.0, 0.009664095373024416, 0.01013408751128283, 0.005568179951254303], "isController": false}, {"data": ["Add New Todo", 5, 0, 0.0, 154.8, 123, 262, 132.0, 262.0, 262.0, 262.0, 0.009665459128639529, 0.010650882891364104, 0.006163617979493762], "isController": false}, {"data": ["Generate Identicon", 5, 0, 0.0, 142.6, 138, 146, 144.0, 146.0, 146.0, 146.0, 0.00966422612742862, 0.023028038819263512, 0.005162433292679156], "isController": false}, {"data": ["Get Recipes - Field Selection", 5, 0, 0.0, 131.8, 124, 160, 125.0, 160.0, 160.0, 160.0, 0.009654969992353263, 0.03328701763769918, 0.005374348530899765], "isController": false}, {"data": ["Get Product Category List", 5, 0, 0.0, 127.0, 123, 133, 124.0, 133.0, 133.0, 133.0, 0.009704592213035209, 0.013165644045262218, 0.005250336021505376], "isController": false}, {"data": ["Get Todos By User Id", 5, 0, 0.0, 128.4, 123, 132, 131.0, 132.0, 132.0, 132.0, 0.009665645974451765, 0.01157045784715134, 0.005134874423927499], "isController": false}, {"data": ["Get All Products", 5, 0, 0.0, 12.6, 10, 17, 12.0, 17.0, 17.0, 17.0, 0.00965965182750953, 0.42624157014259584, 0.005093957018413229], "isController": false}, {"data": ["Update Product (PATCH)", 5, 0, 0.0, 126.0, 123, 132, 125.0, 132.0, 132.0, 132.0, 0.009710114249204257, 0.01510567578025623, 0.005575729666535256], "isController": false}, {"data": ["Get Comments - Paginated", 5, 0, 0.0, 127.8, 124, 133, 126.0, 133.0, 133.0, 133.0, 0.00971281158699571, 0.023160882161255985, 0.005273753166376577], "isController": false}, {"data": ["Get Products - Simulate Delay (perf testing)", 5, 0, 0.0, 2641.0, 2131, 4663, 2137.0, 4663.0, 4663.0, 4663.0, 0.009620102165484997, 0.4242465054978884, 0.005176441692560775], "isController": false}, {"data": ["Get Users - Paginated", 5, 0, 0.0, 129.6, 126, 137, 129.0, 137.0, 137.0, 137.0, 0.009654932705119046, 0.14257054436924324, 0.005214040806573078], "isController": false}, {"data": ["Generate Sized Image", 5, 0, 0.0, 148.2, 143, 152, 151.0, 152.0, 152.0, 152.0, 0.00966235854307093, 0.06866124821729486, 0.0051425638730211495], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 131.6, 123, 156, 124.0, 156.0, 156.0, 156.0, 0.00971309461136937, 0.01476883624013878, 0.005321334059549041], "isController": false}, {"data": ["Get Users - Field Selection", 5, 0, 0.0, 132.6, 126, 151, 127.0, 151.0, 151.0, 151.0, 0.009654988636078375, 0.027320600656153028, 0.005346072809234804], "isController": false}, {"data": ["Delete Comment", 5, 0, 0.0, 141.0, 123, 191, 131.0, 191.0, 191.0, 191.0, 0.009711962612828726, 0.011707467430933378, 0.005349166907847072], "isController": false}, {"data": ["Search Recipes", 5, 0, 0.0, 125.4, 123, 132, 124.0, 132.0, 132.0, 132.0, 0.009654988636078375, 0.010282940045417067, 0.00522349971131584], "isController": false}, {"data": ["Update Post (PATCH)", 5, 0, 0.0, 125.4, 124, 131, 124.0, 131.0, 131.0, 131.0, 0.00971367958067988, 0.014132265468063362, 0.005530346870640986], "isController": false}, {"data": ["Get Todos - Paginated", 5, 0, 0.0, 128.4, 123, 132, 131.0, 132.0, 132.0, 132.0, 0.009711830563519257, 0.018211579148505543, 0.005244767872681786], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 540, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
