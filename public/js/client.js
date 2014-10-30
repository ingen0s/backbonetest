var Bookmark = Backbone.Model.extend({
	id: "id"
});

var BookmarkCollection = Backbone.Collection.extend({
	model: Bookmark,
	url: "/data/bookmarks"
});

var BookmarkView = Backbone.View.extend({
	events: {
		"click .title": "singleBookmarkLink",
		"click .button.delete": "destroy"
	},
	
	tagName: "div",
	className: "col-xs-6 col-md-4 well",
	render: function() {
		var template = $("#bookmark-template").html();
		var compiled = Handlebars.compile(template);
		var html = compiled(this.model.attributes);
		this.$el.html(html);
		return this;
		
	},
	singleBookmarkLink: function(e) {
		e.preventDefault();
		console.log("clicked it");
		var id = this.model.get("id");
		router.navigate("bookmark/" + id);
	}
});

var BookmarkCollectionView = Backbone.View.extend({
	//added
	initialize: function() {
		this.listenTo(this.collection, "reset", this.render);
	},
	//added end
	tagName: "div",
	className: "row jumbotron text-center",
	render: function() {
		//added
		this.$el.html("");
		//added end
		this.collection.each(function(bookmark){
			var bookmarkView = new BookmarkView({model: bookmark});
			this.$el.append(bookmarkView.render().el);
		},this);
		return this;
		
	}

});

var Workspace = Backbone.Router.extend({

  routes: {
    "addbookmarks":                 "addbookmarks"   // #help
    
  },

  addbookmarks: function() {
  	var collection = new BookmarkCollection();
  	collection.fetch({reset: true});
  	var view = new BookmarkCollectionView({ collection: collection});
  	$(".app").html(view.render().el);
  }

});