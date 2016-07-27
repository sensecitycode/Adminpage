var appServices = angular.module('administrationApp.services', []);

appServices.factory('EndPointService', function() {
	  return {
		  bugzillaURL: "http://api.sense.city:3001/bugs/search",
			APIURL: "http://api.sense.city:3000"
	  };
});

appServices.factory('BugService', function ( $resource, EndPointService) {
    return $resource(
        EndPointService.bugzillaURL,
        null,
        {
          search: {
            method: 'POST',
            headers:{'Content-Type':'application/json'},
            isArray: true
          }
        }
    );
});

appServices.factory('Issue2MapService', function ( $resource, EndPointService) {
    // console.log("DisplayIssues");
    return $resource(EndPointService.APIURL+'/api/fullissue/:issueID',
        {issueID:'@id'}
			);
});

appServices.factory('FixPoints2MapService', function ( $resource, EndPointService) {
    // console.log("DisplayFixPoints");
    return $resource(EndPointService.APIURL+'/fix_point/:long/:lat/50/:type',
        {
					long:'@long',
					lat:'@lat',
					type:"@type"
				}
			);
});

appServices.factory('FixPointsMarkerService', function() {
    return {
        icon: function(fixPoint) {
					var icon;
					if (fixPoint.type=="garbage")
					{
						switch(fixPoint.notes[0].ANAKIKLOSI){
							case "0":
								icon = "staticGarbage";
								break;
							case "1":
								icon = "staticGarbageRecycle";
								break;
							default:
								break;
						}
					}
					else
					{
						icon = "staticLighting";
					}
					return icon;
        }
    };
});

appServices.factory('ToGrService', function() {
    return {
        issueName: function(issue_name) {
					switch(issue_name){
						case "garbage":
							issue_name = "Πρόβλημα Καθαριότητας";
							break;
						case "lighting":
							issue_name = "Πρόβλημα Φωτισμού";
							break;
						case "plumbing":
							issue_name = "Πρόβλημα Ύδρευσης";
							break;
						case "road-contructor":
							issue_name = "Πρόβλημα Δρόμου/Πεζοδρομίου";
							break;
						default:
							break;
					}
					return issue_name;
        },

				statusTitle: function(status,resolution) {
					var _status;
					var _style;
					var _icon;
					var _resolution;
					switch(status){
						case "CONFIRMED":
							_status = "Ανοιχτό";
							_style = {color:'red'};
							_icon = "glyphicon glyphicon-exclamation-sign";
							break;
						case "IN_PROGRESS":
							_status = "Σε εκτέλεση";
							_style = {color:'orange'};
							_icon = "glyphicon glyphicon-question-sign";
							break;
						case "RESOLVED":
							_style = {color:'green'};
							_icon = "glyphicon glyphicon-ok-sign";
							switch(resolution){
								case "FIXED":
									_resolution = "Αποκατάσταση";
									break;
								case "INVALID":
									_resolution = "Εσφαλμένη Αναφορά";
									break;
								case "WONTFIX":
									_resolution = "Μη αποκατάσταση / Απόρριψη από Δήμο";
									break;
								case "DUPLICATE":
									_resolution = "Έχει ήδη αναφερθεί σε άλλο αίτημα";
									break;
							}
							_status = "Ολοκληρωμένο";

							break;
						default:
							break;
					}
					return {"status":{"en":status,"gr":_status},"status_style":_style,"status_icon":_icon,"resolution":{"en":resolution,"gr":_resolution}};

				}
    };
});

appServices.factory('CommentService', function() {
    return {
				field: function(status) {
					var field;
					var comment;
					switch(status){
						case "CONFIRMED":
							// field = "url";
							break;
						case "IN_PROGRESS":
							field = "whiteboard";
							break;
						case "RESOLVED":
							field = "cf_sensecityissue";
							break;
						default:
							break;
					}
					return field;

				}
    };
});

appServices.factory('Tab2BugzillaService', function(){
	return{
		issue_type: function(tab) {
			var type;
			switch (tab) {
				case "Γενικά":
					type="all";
					break;
				case "Καθαριότητα":
					type="garbage";
					break;
				case "Φωτισμός":
					type="lighting";
					break;
				case "Ύδρευση":
					type="plumbing";
					break;
				case "Οδόστρωμα":
					type="road-contructor";
					break;
			}
			return type;
		}
	};
});
