var appControllers = angular.module('administrationApp.controllers', []);


appControllers.controller('adminController',['$scope','$window','$http','BugzillaEndPointService','DisplayBugService','ToGrService', function($scope,$window,$http,BugzillaEndPointService,DisplayBugService,ToGrService){
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
            "new_status":panelTitle.new_status,
            "style":panelTitle.status_style,
            "icon":panelTitle.status_icon,
            "time":local_time,
            "issuelink":issuelink,

            "id":id,
            "status":value.status,
            "resolution":value.resolution,
            "new_resolution":panelTitle.new_resolution,
            "admin":false,
            "ArrayID":key,

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
      $scope.initResetPanel(panel);
      panel.admin = true;
      $scope.multipleActivePanels = [panel.ArrayID];

      $scope.statuses = ["Ανοιχτό","Σε εκτελέση","Ολοκληρωμένο"];
      $scope.resolutions = ["Αποκατάσταση","Μη αποδεκτό","Μη αποκατάσταση","Διπλοεγγραφή"];

      $scope.selectedStatus = panel.new_status;

      if (panel.new_resolution !== undefined )
      {
        $scope.selectedResolution = panel.new_resolution;
      } else {
        $scope.selectedResolution = "Αποκατάσταση";
      }
    };



    $scope.initResetPanel = function(panel){
      $scope.selectedStatus = null;
      $scope.selectedResolution = null;
    };

    $scope.resetPanel = function(panel){
      panel.admin = false;
      $scope.comment = null;
      $scope.resolutionbtn = false;
      $scope.selectedStatus = null;
      $scope.selectedResolution = null;
    };

    $scope.submit = function(panel){
      console.log($scope);
      console.log("$scope.selectedstatus");
      console.log($scope.selectedstatus);
      console.log("$scope.selectedResolution");
      console.log($scope.selectedResolution);
      console.log("$scope.comment");
      console.log($scope.comment);
      panel.admin=false;
      // var obj  =
      // {
      //   "method": "Bug.update",
      //   "params": [{ "ids":panel,"status":"IN_PROGRESS","whiteboard":"adasda","product": "Δημος Πατρέων","component": "Τμήμα επίλυσης προβλημάτων"}],
      //   "id": 1
      // };
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
          var id = value.id;
          var issuelink = "http://sense.city/issuemap.php?issue_id="+value.alias;

          var issue_name = ToGrService.issueName(value.summary);



          var panelTitle = ToGrService.statusTitle(value.status,value.resolution);

          var creation_time = value.creation_time;
          var local_time = moment(creation_time).format('LLLL');
          var time_fromNow = moment(creation_time).fromNow();

          // console.log(issuelink);
          var panel =
          {
            "title":"Πρόβλημα #"+id+" ("+issue_name+") -- "+time_fromNow,
            // "body":"Κατάσταση: "+new_status+
            //         "<br>Καταγραφή: "+local_time+
            //         "<br>"+
            //         "<br><a href="+issuelink+">Επισκόπηση</a>",
            "new_status":panelTitle.new_status,
            "style":panelTitle.status_style,
            "icon":panelTitle.status_icon,
            "time":local_time,
            "issuelink":issuelink,

            "id":id,
            "status":value.status,
            "resolution":value.resolution,
            "admin":false,
            "ArrayID":key,

          };
          this.push(panel);
        }, $scope.panels);
      });
    };



//     $scope.admin1 = function(panel){
//       // $scope.initResetPanel(panel);
//       panel.admin = true;
//
//       $scope.multipleActivePanels = [panel.ArrayID];
//
//       $scope.statuses = [
//         {
//           "value":"OPEN",
//           "name":"Ανοιχτό",
//           "resolution":"",
//           "resolutionbtn":false
//         },
//         {
//           "value":"IN_PROGRESS",
//           "name":"Σε εκτέλεση",
//           "resolution":"",
//           "resolutionbtn":false
//         },
//         {
//           "value":"RESOLVED",
//           "name":"Ολοκληρωμένο",
//           "resolution":panel.resolution,
//           "resolutionbtn":true
//         }
//       ];
//       panel.admin = true;
//       $scope.resolutionbtn = false;
//       console.log(panel);
//       // $scope.selectedStatus = null;
//       // console.log($scope.selectedStatus);
//
//       switch(panel.status){
//         case "CONFIRMED":
//           $scope.selectedStatus =  $scope.statuses[0];
//           break;
//         case "IN_PROGRESS":
//           $scope.selectedStatus =  $scope.statuses[1];
//           break;
//         case "RESOLVED":
//           $scope.selectedStatus =  $scope.statuses[2];
//           break;
//         default:
//           break;
//       }
//       // console.log($scope.selectedStatus);
//
//       if ($scope.selectedStatus.resolution !== null)
//       {
//         $scope.resolutionbtn = true;
//         // console.log($scope.selectedStatus.resolution);
//         $scope.resolutions = [
//           {
//             "name": "Αποκατάσταση",
//             "value": "FIXED"
//           },
//           {
//             "name": "Μη αποδεκτό",
//             "value": "INVALID"
//           },
//           {
//             "name": "Μη αποκατάσταση",
//             "value": "WONTFIX"
//           },
//           {
//             "name": "Διπλοεγγραφή",
//             "value": "DUPLICATE"
//           }
//         ];
//         // $scope.selectedResolution = null;
//
//         switch($scope.selectedStatus.resolution){
//           case "FIXED":
//             $scope.selectedResolution =  $scope.resolutions[0];
//             break;
//           case "INVALID":
//             $scope.selectedResolution =  $scope.resolutions[1];
//             break;
//           case "WONTFIX":
//             $scope.selectedResolution =  $scope.resolutions[2];
//             break;
//           case "DUPLICATE":
//             $scope.selectedResolution =  $scope.resolutions[3];
//             break;
//           default:
//             break;
//         }
//         // console.log($scope.selectedResolution);
//       }
//     };
//
}]);
