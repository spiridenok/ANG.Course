'use strict';

angular.module('confusionApp')

        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;

            $scope.dishes= menuFactory.getDishes();

                        
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

            var dish= menuFactory.getDish(parseInt($stateParams.id,10));
            
            $scope.dish = dish;
            
        }])

        .controller('DishCommentController', ['$scope', function($scope) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                
                $scope.dish.comments.push($scope.mycomment);
                
                $scope.commentForm.$setPristine();
                
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
        }])

        // implement the IndexController and About Controller here
        .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function ($scope, menuFactory, corporateFactory) {
            $scope.dish = menuFactory.getDish(0);
            $scope.showLeaderMenu = false;
            $scope.leaderErrorMessage = 'Loading...';

            corporateFactory.getLeaders().query(
                function (response) {
                    $scope.leader = response[3];
                    $scope.showLeaderMenu = true;
                },
                function (response) {
                    $scope.leaderErrorMessage = "Error: " + response.status + " " + response.statusText;
            });

            $scope.showPromotionMenu = false;
            $scope.promotionErrorMessage = 'Loading...';
            menuFactory.getPromotions().query(
                function (response) {
                    $scope.promotion = response[0];
                    $scope.showPromotionMenu = true;
                },
                function (response) {
                    $scope.promotionErrorMessage = "Error: " + response.status + " " + response.statusText;
            });
        }])

        .controller('AboutController', ['$scope', 'corporateFactory', function ($scope, corporateFactory) {
            $scope.showMenu = false;

            $scope.leaders = corporateFactory.getLeaders().query(
                function (response) {
                    $scope.leaders = response;
                    $scope.showMenu = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                });
        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

            $scope.sendFeedback = function() {
                console.log($scope.feedback);
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "") && !$scope.feedback.mychannel) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;

                    feedbackFactory.sendFeedback().update($scope.feedback);
                    $scope.feedback = {
                        mychannel: "", firstName: "", lastName: "",
                        agree: false, email: ""
                    };
                    $scope.feedback.mychannel = "";

                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }]);
;