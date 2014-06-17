// $.ajax({
//   url: "/api/retrieveTweets/abcd",
//   type: "GET",
//   data: {
//     page: 1
//   },
//   success: function(response) {
//     for (var i=0; i < response.length; i++){
//       $('#content-container').append(window.JST.tweetContent(response[i]));

//     }
//   }
// });


$(document).ready(function(){
  var testView = Backbone.View.extend({
    initialize: function(){
      this.listenTo(this.model, 'change', this.render);
    },
    el: '#test',
    render: function(){
      // this.$el.html(this.model.getAllCourses() + "<input val='"+this.model.get('entree')+"'>");
      this.$el.html(window.JST.new());
    },
    events: {
      "click p": "clickedHere",
      "change input": "updateModel",
    },
    updateModel: function(){
      // this.model.set($('#input-field').value())
      this.model.set('entree', this.$('input').val());
    },
    clickedHere: function(){
      // alert("hey! you clicked the element that the testView is attached to");
      this.render();
    },
  });

  var tweetView = Backbone.View.extend({
    initialize: function(){
      this.listenTo(this.collection, 'sync sort', this.render);
    },
    el: '#content-container',
    render: function(){
      this.$el.empty();
      this.$el.append(window.JST.sortButtons());
      for (var i=0; i < this.collection.length; i++){
        this.$el.append(window.JST.tweetContent(this.collection.at(i).toJSON()));
      }
    },
    events: {
      "click p": "clickedHere",
      "change input": "updateModel",
      "click .sort": "sortTweets",

    },
    sortTweets: function(e){
      this.collection.comparator = $(e.target).data("by");
      this.collection.sort();
    },
    updateModel: function(){
      // this.model.set($('#input-field').value())
      this.model.set('entree', this.$('input').val());
    },
    clickedHere: function(){
      // alert("hey! you clicked the element that the testView is attached to");
      this.render();
    },
  });

  var tweetModel = Backbone.Model.extend({

  });

  var tweetCollection = Backbone.Collection.extend({
    model: tweetModel,
    url: "/api/retrieveTweets/abcd",
  });

  window.coll = new tweetCollection();
  window.coll.fetch({data:{page: 1}});

  var testModel = Backbone.Model.extend({
    defaults: {
      "appetizer":  "caesar salad",
      "entree":     "ravioli",
      "dessert":    "cheesecake"
    },
    getAllCourses: function(){
      return _.values(this.attributes).join(', ');
    },
  });

  window.testModel = new testModel();
  window.tweetView = new tweetView({'collection': window.coll});

  var topRetweeted = Backbone.View.extend({
    initialize: function(){
      this.listenTo(this.collection, 'sync', this.render);
    },
    el: "#most-retweets",
    render: function(){
      this.$el.empty();
      this.$el.html("<h3>Most Retweeted Tweets</h3>");
      this.collection.comparator = function(tweet){
        return -tweet.get("retweet_count");
      };
      this.collection.sort();
      for(var i = 0; i < 3; i++){
        this.$el.append(window.JST.tweetContent(this.collection.at(i).toJSON()));
      }
    },
  });

  var mostTweetedFrom = Backbone.View.extend({
    initialize: function(){
      this.listenTo(this.collection, 'sync', this.render);
    },
    el: "#most-tweeted-from",
    render: function(){
      this.$el.empty();
      var locations = this.topUserLocations();
      this.$el.html(window.JST.mostTweeted(locations));
      var $expList = this.$el.find('#explist');
      _.each(locations, function(count,location){ //first arg is # of tweets from location (locationsByCount[location]), second is just location (e.g. "Singapore")
        if(count > 1 && location !== ""){
          $expList.append("<li>"+location+"<ul class='tweetsfrom"+location+"'></ul></li>");
          // var tfl = tweetsFromLocation(location);
          // for(var i = 0; i < tfl; i++) {
          //   $(".tweetsfrom" + location).append(window.JST.tweetContent(tfl[i]));
          // }
          for(var j = 0; j< this.collection.length; j++) {
            if(this.collection.at(j).get("user").location === location) {
              $('.tweetsfrom' + location).append(window.JST.tweetContent(this.collection.at(j).toJSON()));
            }
          }
        }
      }, this);

      $expList.find('li:has(ul)').click( function(event) {
          if (this == event.target) {
            $(this).toggleClass('expanded');
            $(this).children('ul').toggle('medium');
          }
          return false;
        }).addClass('collapsed').children('ul').hide();
    },
    topUserLocations: function() {
      var locationsByCount = {};
      for(var i = 0; i < this.collection.length; i++) {
        if(locationsByCount[this.collection.at(i).get("user").location]){
          locationsByCount[this.collection.at(i).get("user").location]++;
        }
        else{
          locationsByCount[this.collection.at(i).get("user").location] = 1;
        }
      }
      return locationsByCount;
    },
    // tweetsFromLocation: function(location) {
    //   var tweets = [];
    //   for(var i = 0; i< this.collection.length; i++) {
    //     if(this.collection.at(i).get("user").location === location) {
    //       tweets.push(this.collection.at(i));
    //     }
    //   }
    // },
  });

  window.topRetweeted = new topRetweeted({'collection': window.coll});
  window.mostTweetedFrom = new mostTweetedFrom({'collection': window.coll});

});


function postTweet() {
  $.ajax({
    type: "post",
    url:"/api/postTweet",
    data: {
      username: "first last",
      message: "hello"
    },
    success: function(response){
    },
    error: function(xhr, status, error) {
    }

  });
}