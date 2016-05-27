var appControllers = angular.module('administrationApp.controllers', []);


appControllers.controller('adminController',['$scope','$window','$http','BugzillaEndPointService','BugService','ToGrService','CommentService', function($scope,$window,$http,BugzillaEndPointService,BugService,ToGrService,CommentService){
    $scope.panels = [];
    $scope.multipleActivePanels = [];
    moment.locale('el');

    var pageload = function(callback) {
      var obj =
      {
          "method": "Bug.search",
          "params": [{"product": "Δημος Πατρέων","component": "Τμήμα επίλυσης προβλημάτων","include_fields":["component","cf_sensecityissue","status","id","alias","summary","creation_time","whiteboard","resolution"]}],
          "id": 1
      };
      BugService.search(obj, function(result) {

        angular.forEach(result, function(value,key) {
          var issue_name = ToGrService.issueName(value.summary);
          var panelTitle = ToGrService.statusTitle(value.status,value.resolution);

          var id = value.id;
          var issuelink = "http://sense.city/issuemap.php?issue_id="+value.alias;
          var creation_time = value.creation_time;
          var local_time = moment(creation_time).format('LLLL');
          var time_fromNow = moment(creation_time).fromNow();

          var panel =
          {
            "title":"Πρόβλημα #"+id+" ("+issue_name+") -- "+time_fromNow,

            "style":panelTitle.status_style,
            "icon":panelTitle.status_icon,
            "time":local_time,
            "issuelink":issuelink,

            "id":id,
            "status":panelTitle.status,
            "new_status":"",
            "resolution":panelTitle.resolution,
            "new_resolution":"",
            "admin":false,
            "ArrayID":key,
            "comment":null

          };
          this.push(panel);
        }, $scope.panels);
      });

    };


    pageload(function(callback){
    });

    // $scope.$watch(
    // function( $scope ) {
    //     console.log( "Function watched" );
    //     // This becomes the value we're "watching".
    //     return(  $scope.selectedStatus );
    // },
    // function( newValue ) {
    //     console.log("new");
    //     console.log( newValue );
    //     return(  newValue );
    // }
    // );
    $scope.admin = function(panel){
      // $scope.initResetPanel(panel);
      panel.admin = true;
      $scope.multipleActivePanels = [panel.ArrayID];

      $scope.statuses = [{"gr":"Ανοιχτό","en":"CONFIRMED"},{"gr":"Σε εκτελέση","en":"IN_PROGRESS"},{"gr":"Ολοκληρωμένο","en":"RESOLVED"}];
      $scope.resolutions = [{"gr":"Αποκατάσταση","en":"FIXED"},{"gr":"Μη αποδεκτό","en":"INVALID"},{"gr":"Μη αποκατάσταση","en":"WONTFIX"},{"gr":"Διπλοεγγραφή","en":"DUPLICATE"}];

      $scope.selectedStatus = panel.status;
      if (panel.resolution.gr !== undefined )
      {
        $scope.selectedResolution = {"gr":panel.resolution.gr,"en":panel.resolution.en};
      } else {
        $scope.selectedResolution = {"gr":"Αποκατάσταση","en":"FIXED"};
      }
    };



    $scope.initResetPanel = function(panel){
      $scope.selectedStatus = null;
      $scope.selectedResolution = null;
    };

    $scope.resetPanel = function(panel,seldstatus,seldResolution,seldcomment){
      console.log("before");
      console.log(seldstatus);
      console.log(seldResolution);
      console.log(seldcomment);
      panel.admin = false;
      seldcomment = {};
      seldstatus = {};
      seldResolution = {};

      console.log("after");
      console.log(seldstatus);
      console.log(seldResolution);
      console.log(seldcomment);


    };

    $scope.submit = function(panel,seldstatus,seldResolution,seldcomment){
      var panelTitle = ToGrService.statusTitle(seldstatus.en,seldResolution.en);
      panel.style = panelTitle.status_style;
      panel.icon = panelTitle.status_icon;

	    panel.status = seldstatus;
      if (panel.status.en == "RESOLVED")
      {
        panel.resolution = seldResolution;
      }
      else
      {
        panel.resolution = {"en":""};
      }
      panel.comment = seldcomment;
      panel.admin=false;
      console.log("Panel changes to submit:");
      console.log(panel.status);
      console.log(panel.resolution);
      console.log(panel.comment);


      var bug_fieldname = CommentService.field(panel.status.en);
      console.log(bug_fieldname);
      console.log(panel);

      var obj = { "ids":panel.id,"status":panel.status.en,"product": "Δημος Πατρέων","component": "Τμήμα επίλυσης προβλημάτων"};
      if (panel.comment !== undefined)
      {
        obj[bug_fieldname] = panel.comment;
      }
      if (panel.status.en == "RESOLVED")
      {
        obj.resolution = panel.resolution.en;
      }
      console.log(obj);

      var body  =
      {
        "method": "Bug.update",
        "params": [obj],
        "id": 1
      };
      console.log(body);
      BugService.search(body, function(result) {
        console.log(result);
      });

    };



    $scope.refresh=function(){
      $scope.panels = [];

      var obj =
      {
          "method": "Bug.search",
          "params": [{"product": "Δημος Πατρέων","component": "Τμήμα επίλυσης προβλημάτων","include_fields":["component","cf_sensecityissue","status","id","alias","summary","creation_time","whiteboard","resolution"]}],
          "id": 1
      };
      DisplayBugService.search(obj, function(result) {

        angular.forEach(result, function(value,key) {
          var issue_name = ToGrService.issueName(value.summary);
          var panelTitle = ToGrService.statusTitle(value.status,value.resolution);

          var id = value.id;
          var issuelink = "http://sense.city/issuemap.php?issue_id="+value.alias;
          var creation_time = value.creation_time;
          var local_time = moment(creation_time).format('LLLL');
          var time_fromNow = moment(creation_time).fromNow();

          var panel =
          {
            "title":"Πρόβλημα #"+id+" ("+issue_name+") -- "+time_fromNow,

            "style":panelTitle.status_style,
            "icon":panelTitle.status_icon,
            "time":local_time,
            "issuelink":issuelink,

            "id":id,
            "status":panelTitle.status,
            "new_status":"",
            "resolution":panelTitle.resolution,
            "new_resolution":"",
            "admin":false,
            "ArrayID":key,
            "comment":null

          };
          this.push(panel);
        }, $scope.panels);
      });

    };



}]);
