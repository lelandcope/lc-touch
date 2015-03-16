###
	Controllers
###

application.controller 'AppCtrl', ['$scope', ($scope)->

]

application.controller 'ExampleCtrl', ['$scope', '$timeout', ($scope, $timeout)->
	$scope.gallery = [
		{
			"thumb":"https://s3.amazonaws.com/thumbnails.mediasilo.com/672198256UAVP/ED42F19B-E0E9-61DF-64D0FAE55DE261A2_large.jpg"
			"title":"sfsdf.jpg"
			"caption":""
			"count":7
		}
		{
			"thumb":"https://s3.amazonaws.com/thumbnails.mediasilo.com/672198256UAVP/ED42F853-0177-6620-85E1F184FBF0E766_large.jpg"
			"title":"old_hanks_forweb.jpg"
			"caption":""
			"count":7
		}
		{
			"thumb":"https://s3.amazonaws.com/thumbnails.mediasilo.com/672198256UAVP/ED42F92F-9355-E0F3-9BF2B1F69A6AFFAF_large.jpg"
			"title":"gyjttyu.jpg"
			"caption":""
			"count":7
		}
	]

	$timeout ()->
		console.debug 'Change Up'

		$scope.gallery = [
			{
				"thumb":"https://s3.amazonaws.com/thumbnails.mediasilo.com/672198256UAVP/ED42F853-0177-6620-85E1F184FBF0E766_large.jpg"
				"title":"old_hanks_forweb.jpg"
				"caption":""
				"count":7
			}
			{
				"thumb":"https://s3.amazonaws.com/thumbnails.mediasilo.com/672198256UAVP/ED42F19B-E0E9-61DF-64D0FAE55DE261A2_large.jpg"
				"title":"sfsdf.jpg"
				"caption":""
				"count":7
			}
			{
				"thumb":"https://s3.amazonaws.com/thumbnails.mediasilo.com/672198256UAVP/ED42F593-0BF1-9556-49DDFBEBDDF9C6C3_large.jpg"
				"title":"wetjkgj.jpg"
				"caption":""
				"count":7
			}
			{
				"thumb":"https://s3.amazonaws.com/thumbnails.mediasilo.com/672198256UAVP/ED42F92F-9355-E0F3-9BF2B1F69A6AFFAF_large.jpg"
				"title":"gyjttyu.jpg"
				"caption":""
				"count":7
			}
			{
				"thumb":"https://s3.amazonaws.com/thumbnails.mediasilo.com/672198256UAVP/ED42FB4B-D5DB-1EFC-7BFEE9A867BCBFFD_large.jpg"
				"title":"345345.jpg"
				"caption":""
				"count":7
			}
		]
	, 5000
]

