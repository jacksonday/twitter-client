$(document).ready(function() {
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
      debugger;
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
      "click .refresh": "refreshCollection"
    },
    sortTweets: function(e){
      this.collection.comparator = $(e.target).data("by");
      this.collection.sort();
    },
    refreshCollection: function(e){
      this.collection.fetch({max_id: this.collection.max_id});
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
    initialize: function(){
      this.listenTo(this, 'sync', this.setMaxID);
    },
    model: tweetModel,
    setMaxID: function() {
      this.max_id = this.toJSON()[this.length-1].id;
      // console.log(this.length);
    },
    max_id: null,
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

  var mostTweetedDetail = Backbone.View.extend({
    //location and tweets for location and render template
    initialize: function(options){
      this.location = options.location;
      this.tweets = options.tweets;
    },
    events: {
      "click .location-name": "toggleList",
    },
    toggleList: function(e){
      this.$('.location-tweets').toggleClass('expanded');
  
    },
    render: function(){
      return this.$el.html(window.JST.mostTweetedDetail({"myLocation": this.location, "myTweets": this.tweets}));
    }
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
          $expList.append(new mostTweetedDetail({'location': location, 'tweets': this.tweetsFromLocation(location)}).render());
        }
      }, this);

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
    tweetsFromLocation: function(location) {
      var tweets = [];
      for(var i = 0; i< this.collection.length; i++) {
        if(this.collection.at(i).get("user").location === location) {
          tweets.push(this.collection.at(i).toJSON());
        }
      }
      return tweets;
    },
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