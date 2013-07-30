// moon.sample.login.FrontDoorViaPanelSample

enyo.kind({
	
	//* @public
	name  : 'moon.sample.login.FrontDoorViaPanelSample',
	kind  : 'moon.Panel',
	
	//* @protected
	title : '3rd PARTY APP NAME',
	components: [
		{kind: 'HFlexBox', components: [
			{name: 'appInfo', kind: 'enyo.DataRepeater', components: [
					{
						kind     : 'moon.Button',
						ontap    : 'selectApp',
						bindFrom : 'text',
						style    : 'width: 300px;',
						classes  : 'moon-dark-gray moon-margin-top-bottom'
					}
				]
			},
			{flex: true, components:[                
				{kind: 'HFlexBox', classes: 'moon-margin-top-bottom moon-input-decorator-flex', components:[
					{content: 'Email', style: 'width: 180px;'},
					{
						kind : 'moon.InputDecorator',
						flex : true,
						components: [{
							name     : 'email',
							kind     : 'moon.Input',
							onchange : 'emailChanged'
						}]
					}
				]},
				{kind: 'HFlexBox', classes: 'moon-margin-top-bottom moon-input-decorator-flex', components:[
					{content: 'Password', style: 'width: 180px; margin-bottom: 20px;'},
					{
						kind : 'moon.InputDecorator',
						flex : true,
						components: [{
							name     : 'password',
							kind     : 'moon.Input',
							onchange : 'passwordChanged',
							type     : 'password'
						}]
					}
				]},
				{
					kind : 'HFlexBox',
					flex       : true,
					classes    : 'moon-margin-top-bottom',
					components: [
						{style: 'width: 250px;', classes: 'moon-margin-left-right', components:[
							{style: 'height: 32px'},
							{
								kind    : 'moon.CheckboxItem',
								checked : true,
								content : 'Log in setting'
							}
						]},
						{
							kind    : 'moon.Button',
							content : 'Log in',
							flex    : true,
							classes : 'moon-dark-gray moon-margin-left-right'
						},
						{
							kind    : 'moon.Button',
							content : 'Registration',
							flex    : true,
							classes : 'moon-dark-gray'
						}
					]
				}
			]}
		]}
	],
	bindings: [
		{
			from : '.controller.apps', 
			to   : '$.appInfo.controller'
		}
	],

	//* @public

	emailChanged: function(){
		this.log('The email was changed');
	},
	passwordChanged: function(){
		this.log('The password was changed');
	}
});

enyo.ready(function(){

// Sample model

	var sampleModel = new enyo.Model({
		apps: new enyo.Collection([
			{text: 'LOG IN WITH FACEBOOK'},
			{text: 'LOG IN WITH TWITTER'},
			{text: 'JOIN APP'}
		])
	});

//  Application to render sample

	new enyo.Application({
		view: {
			classes: 'enyo-unselectable moon',
			components: [
				{kind: 'enyo.Spotlight'},
				{
					kind       : 'moon.sample.login.FrontDoorViaPanelSample',
					controller : '.app.controllers.loginFrontDoorViaPanelController',
					classes    : 'enyo-fit'
				}
			]
		},
		controllers: [
			{
				name  : 'loginFrontDoorViaPanelController',
				kind  : 'enyo.ModelController',
				model : sampleModel,
				
				selectApp: function(inSender, inEvent) {
					inSender.parent.controller.set('text', 'We are the Champions');
				}
			}
		]
	});
});
