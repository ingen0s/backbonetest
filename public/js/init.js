

$(function() {
	
	router = new Workspace();
	Backbone.history.start({pushState: true});
	
	//initialize
	var collection = new BookmarkCollection();
	collection.fetch({
		success: function(data) {
			var view = new BookmarkCollectionView ({ collection: data});
			$("body").append(view.render().el);
		}
	});
	
});