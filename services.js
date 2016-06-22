var appServices = angular.module('administrationApp.services', []);

appServices.factory('BugzillaEndPointService', function() {
	  return {
		  bugzillaURL: "http://api.sense.city:3001/bugs/search"
	  };
});

appServices.factory('BugService', function ( $resource, BugzillaEndPointService) {
    return $resource(
        BugzillaEndPointService.bugzillaURL,
        null,
        {
          search: {
            method: 'POST',
            headers:{'Content-Type':'application/json'},
            isArray: true
          },
		  update: {
            method: 'POST',
            headers:{'Content-Type':'application/json'},
            isArray: false
          }
        }
    );
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
							_status = "Σε εκτελέση";
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
									_resolution = "Μη αποδεκτό";
									break;
								case "WONTFIX":
									_resolution = "Μη αποκατάσταση";
									break;
								case "DUPLICATE":
									_resolution = "Διπλοεγγραφή";
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
							field = "url";
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
