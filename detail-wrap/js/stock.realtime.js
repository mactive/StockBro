    $(function () {

        /* ================================
         * AutoComplate 
         * ================================ 
         */ 

        var AutoComplateModel = Backbone.Model.extend({
            label: function () {
                return this.get("symbol") +"  "+ this.get("short") ;
            },
            label_for_show: function(){
                return this.get("symbol") +" "+ this.get("name") ;
            }
        });

        var AutoComplateCollection = Backbone.Collection.extend({
            model: AutoComplateModel
        });

        // object {"symbol":"sz000030","short":"FAGF","name":"富奥股份"},
        var autoComplateInstance = new AutoComplateCollection(STOCK_LIST_OBJECTS);

        new AutoCompleteView({
            input: $("#plugin"),
            model:autoComplateInstance,
            onSelect: function (model) {
                // AutoComplate list
                $("#selected").show().find("p").html(model.label_for_show());
                // Chart Image
                $("#chart").find("img").attr('src','http://chart.7878.com/kd/'+model.get("symbol")+'.gif');

                /* Stcok realtime */
                var theStocksCollection = new StocksCollection();
                theStocksCollection.fetch({url:'http://api.stockbro.com/stock/realtime/ddd',
                    success:function(collection,response){
                        // console.log(collection);

                        var peopleView = new StocksView({ collection: theStocksCollection });
                        $('#stock_realtime').append(peopleView.render().el);

                    },
                    error:function(collection, response){
                        console.log(collection);
                        console.log(response);
                        alert('error');
                    }
                });
            }
        }).render();


        /* 
         * =============================================================
         * fetch realtime
         * ============================================================= 
         */ 

        // Stock Model
        var OneStockModel = Backbone.Model.extend({
            initialize:function(){
                // console.log("create a model");
            },
            defaults:{
                symbol:'',
                time:'',
                name:'',
                close:'',
                open:'',
                high:'',
                low:'',
                current:'',
                volumn:'',
                amount:'',
                buy1:'',
                buy2:'',
                buy3:'',
                buy4:'',
                buy5:'',
                sell1:'',
                sell2:'',
                sell3:'',
                sell4:'',
                sell5:'',
                volumn_buy1:'',
                volumn_buy2:'',
                volumn_buy3:'',
                volumn_buy4:'',
                volumn_buy5:'',
                volumn_sell1:'',
                volumn_sell2:'',
                volumn_sell3:'',
                volumn_sell4:'',
                volumn_sell5:''
            }
        });

        // A List of Stock
        var StocksCollection = Backbone.Collection.extend({
            model: OneStockModel,
            parse:function(objects){
                var result = {};
                console.log('parse first');
                $.each(objects , function(key, response) {

                    var item = {
                        symbol: response.c,
                        time:   response.t,
                        name:   response.n,
                        close:  response.lc,
                        open:   response.o,
                        high:   response.h,
                        low:    response.l,
                        current:    response.np,
                        volumn: response.v,
                        amount: response.a,
                        buy1:   response.bp[0],
                        buy2:   response.bp[1],
                        buy3:   response.bp[2],
                        buy4:   response.bp[3],
                        buy5:   response.bp[4],
                        sell1:  response.sp[0],
                        sell2:  response.sp[1],
                        sell3:  response.sp[2],
                        sell4:  response.sp[3],
                        sell5:  response.sp[4],
                        volumn_buy1:    response.bv[0],
                        volumn_buy2:    response.bv[1],
                        volumn_buy3:    response.bv[2],
                        volumn_buy4:    response.bv[3],
                        volumn_buy5:    response.bv[4],
                        volumn_sell1:   response.sv[0],
                        volumn_sell2:   response.sv[1],
                        volumn_sell3:   response.sv[2],
                        volumn_sell4:   response.sv[3],
                        volumn_sell5:   response.sv[4]
                    };

                    objects[key] = item;
                });

                return objects;
            }
        });


        // View for all stocks
        var StocksView = Backbone.View.extend({
            render: function() {
                this.collection.each(function(person) {
                    var oneStockView = new OneStockView({ model: person });
                    this.$el.append(oneStockView.render().el);
                }, this);

                return this;
            }
        });

        // The View for an stcok
        var OneStockView = Backbone.View.extend({
            tagName: 'ul',

            template: _.template($('#realtime_template').html() ),
            
            render: function() {
                this.$el.html( this.template( {"stock_info":this.model.toJSON() } ) );
                return this;
            }
        });

    });