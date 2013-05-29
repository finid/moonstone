enyo.kind({
    name: "moon.sample.photos.PhotoGridSample",
	kind: "moon.Panel",
	classes: "moon enyo-unselectable photos-album",
	titleAbove: "02",
	title: "Album Name",
	titleBelow: "97 Photos",
	imageList: [
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"}
	],
	components: [	
/** If you want to use this template alone with spotlight, remove this comment out.
        {kind: "enyo.Spotlight"},
*/
		{
			name: "gridlist",
			kind: "moon.GridList",
			fit: true,
			onSetupItem: "setupGridItem",
			touch: true,
			itemWidth: 270,
			itemHeight: 202,
			itemSpacing: 20,
			components: [
				{name: "gridItem", kind: "moon.GridList.ImageItem"}
			]
		}
	],

	headerComponents: [
		{kind: "moon.IconButton", src: "assets/icon-round-extend.png"},
		{kind: "moon.IconButton", src: "assets/icon-round-share.png"},
		{kind: "moon.IconButton", src: "assets/icon-round-download.png"},
		{kind: "moon.IconButton", src: "assets/icon-round-delete.png"}
	],
	
	rendered: function() {
		this.inherited(arguments);
		this.$.gridlist.show(this.imageList.length);
	},

	setupGridItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var gridItem = this.imageList[i];
		if (!gridItem.src) {
			return;
		}
		this.$.gridItem.setSource(gridItem.src);
		this.$.gridItem.setSelected(this.$.gridlist.isSelected(i));
	},
});