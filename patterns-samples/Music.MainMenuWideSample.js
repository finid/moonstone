enyo.kind({
    name: "moon.MusicMainMenuWideSample",
    layoutKind: "enyo.FittableRowsLayout",
    fit: true,
    title: "Main Menu",
    titleAbove: "01",
    classes: "moon moon-music-mainmenu",
    components: [
        {kind: "enyo.Spotlight"},
        {kind: "moon.Header", content: "Main Menu", titleAbove: "01"},
        {
            name: "columns",
            kind: "FittableColumns",
            components: [
                {
                    classes: "moon-music-mainmenu-menu",
                    components: [
                        {kind: "moon.Item", content: "Browser Tracks", spotlight: true},
                        {kind: "moon.Item", content: "Browser Albums", spotlight: true},
                        {kind: "moon.Item", content: "Browser Artists", spotlight: true},
                        {kind: "moon.Item", content: "Browser Playlist", spotlight: true},
                    ]
                },
                {
                    name: "content",
                    fit: true,
                    classes: "moon-music-mainmenu-content",
                    components: [
                        {
                            name: "branding",
                            fit: true,
                            classes: "moon-music-mainmenu-branding",
                            content: "branding"
                        }
                    ]
                }
            ]
        }
    ],
    
    rendered: function() {
        this.inherited(arguments);
        this.resizeBranding();
    },
    
    resizeBranding: function() {
        var w = this.$.content.node.offsetWidth;
        var h = window.innerHeight - this.$.columns.node.offsetTop - 22;
        if (this.w !== w || this.h !== h) {
            this.$.branding.setStyle("width: " + w + "px; height: " + h + "px;");
            this.w = w;
            this.h = h;
        }
    }
});
