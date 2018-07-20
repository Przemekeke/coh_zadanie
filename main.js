$(document).ready(function() {
    $.ajax({
        url: 'https://stock.ssangyong.pl/api/getHotModels/',
        dataType: 'json',
        success: function(result) {  
            $.each(result, function(i, field){
                $('<br/>').appendTo("#modelcheckbox");
                $('<input/>', { type: 'checkbox', name: field.model, value: field.model, checked: "checked" }).appendTo("#modelcheckbox");
                $("#modelcheckbox").append(field.model + " ");
            });
        }
    });

    $.ajax({
        url: 'https://stock.ssangyong.pl/api/getHotoffers/',
        dataType: 'json',
        success: function(result) {  
            $.each(result, function(i, field){
                var model = field.params.model.toLowerCase();
                var my = field.params.my;
                var color = field.params.color.toLowerCase().replace(" ", "_");
                var model_image = "https://www.ssangyong.pl/konfigurator-images/images/" + model + "/" + my + "/colors/cars/" + color + ".png";
                
                $('<div />', {id: field.id, class: "offer row " + field.params.model}).appendTo("#offers");
               
                $('<div />', {id: "imageHolder" , class: "holder"}).appendTo("#" + field.id);
                $('#' + field.id + " #imageHolder").append('<div><span>' + field.params.model + '</span> ' + field.params.trim + '</div>')
                
                if(field.new_used == "new")
                    $('#' + field.id + " #imageHolder").append('<p id="new"> NOWY </p>')

                $('#' + field.id + " #imageHolder").append('<img class="modelImage" src=' + model_image + ' />')
                
                $('<div />', {id: "infoHolder", class: "holder"}).appendTo("#" + field.id);
                $("#" + field.id + " #infoHolder").append('<div><div class="info"><span>' + field.params.engine_capacity
                + " " + field.params.fuel_type + "</span> " + field.params.transmission + " " + field.params.gearbox +
                " | " + field.params.color + '</div><div class="minorDetails"> <p>Wersja: <span>' + field.params.trim + '</span> </p> <p>Rok produkcji: <span>'
                 + field.params.year + '</span> </p> <p>Rok modelowy: <span>' + field.params.my + '</span> </p> <p>Wyposażenie: <span>' + field.params.option 
                 + '</span> </p></div> </div>');           

                $('<div />', {id: "priceHolder", class: "holder"}).appendTo("#" + field.id);
                $("#" + field.id + " #priceHolder").append('<div><p class="price">Cena bazowa: <span>' +  
                field.params.price.srp + '<sup> PLN</sup></span></p> <p class="price">Rabat: <span>-' +  
                field.params.price.discount + '<sup> PLN</sup> </span> </p> <p class="hot" value="'+ 
                field.params.price.hot_price +'">Gorąca cena: <span>' + field.params.price.hot_price + 
                '<sup> PLN</sup> </span> </p> <button class="askBtn"> Zapytaj </button> </div>');  
                
                if(field.status == "sold"){
                   $("#" + field.id).append('<span class="sold">SPRZEDANY<span>');
                   $("#" + field.id + " button").attr("disabled", true);
                }

            });
        }
    });

    var selectedModels = [];

    function sortOffers(order) {
        $divs=$("div.offer");
        var hotOffersSorted = $divs.sort(function (a, b) {
            var value1 =  parseInt($(a).find(".hot").attr("value").replace(/\s/g, ''));
            var value2 =  parseInt($(b).find(".hot").attr("value").replace(/\s/g, ''));
            if (order == "asc")
                var result = (value1 < value2 ? -1 : (value1 > value2 ? +1 : 0));
            else if (order == "desc")
                var result = (value1 > value2 ? -1 : (value1 < value2 ? +1 : 0));
            return result;
        });
        $("#offers").append(hotOffersSorted);
    }

    function showSelectedModels(selectedModels) {
        $('#offers .offer').each(function() {
            models = $(this).attr('class').split(' ');
            models = models[2];
            var isModelChecked = $.inArray(models, selectedModels);
            if (isModelChecked == -1)
                $(this).hide();
            else
                $(this).show();
        });
    }

    function getHotoffers(sortd, modelsd) {
        $.post("index.html",
        {
            sort: sortd,
            model: modelsd
        },
        function(data, status){
            showSelectedModels();
            sortOffers();
        });
    }

    $("#main").on("click","#modelcheckbox",function() {
        selectedModels = []
        $('#modelcheckbox input:checked').each(function() {
            selectedModels.push($(this).attr('name'));
        });
        showSelectedModels(selectedModels);
    });

    $("#sort").on("click","a",function() {
        //selectedModels = [];
       // $('#modelcheckbox input:checked').each(function() {
       //     selectedModels.push($(this).attr('name'));
     //   });
        //getHotoffers($(this).attr("id"), selectedModels);
        sortOffers($(this).attr("id"));
    });
});