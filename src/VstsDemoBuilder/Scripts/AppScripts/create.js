﻿/// <reference path="../jquery-1.12.4.min.js" />
$(document).ready(function () {

    $("#privateTemplatepop").removeClass('d-block').addClass('d-none');

    $('#buildYourTemplate').click(function () {
        ga('send', 'event', 'Build Your Template', 'visited');
    });

    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll > 50) {
            $(".navbar").css("background-color", "#2279C3");
        }
        else {
            $(".navbar").css("background-color", "transparent");
        }
    });

    $("input[id=Random]").attr('disabled', true);
    $("input[id=Select]").attr('disabled', true);
    $("#btnUserShow").attr('disabled', true);

    ga('send', 'event', 'Create page', 'visited');
});
var messageList = [];
/**/
/**/
var ID = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
};
var uniqueId = "";
/**/
/**/
var ErrorData = '';
var statusCount = 0;
var selectedTemplate = "";
var messagesCount = 8;
var percentForMessage = Math.floor(100 / messagesCount);
var currentPercentage = 0;
var projectNameForLink = '';
var isExtensionNeeded = false;
var isAgreedTerms = false;
var microsoft = "";
var ThirdParty = "";
var AccountNameForLink;
var templateFolder = "";
var publicTemplateMsg = "";
var privateTemplateMsg = "";

$(document).ready(function (event) {
    uniqueId = ID();
    $('.rmverror').click(function () {
        var errID = this.id;
        $('#' + errID+'_Error').removeClass("d-block").addClass("d-none");
    });
    $('body').on('click', '.rmverrorOn', function () {
        var errID = this.closest('div').nextSibling.getAttribute('id');
        $('#' + errID).removeClass("d-block").addClass("d-none");
    });

    $('#templateselection').click(function () {
        $('.VSTemplateSelection').removeClass('d-none').addClass('d-block');
        $('#ddlTemplates_Error').removeClass("d-block").addClass("d-none");
        ga('send', 'event', 'Choose Template Button', 'Clicked');
    });

    //ON CHANGE OF ACCOUNT- VALIDATE EXTENSION
    $('#ddlAcccountName').change(function () {
        $('#status-messages').empty().hide();
        $('#textMuted').removeClass("d-block").addClass("d-none");
        $('#dvProgress').removeClass("d-block").addClass("d-none");
        $('#accountLink').empty();
        $('#finalLink').removeClass("d-block").addClass("d-none");
        $('#errorNotify').removeClass("d-block").addClass("d-none");
        $('#templateselection').removeClass("btn-primary").prop("disabled", true);
        var accountNameToCheckExtension = $('#ddlAcccountName option:selected').val();
        var checkExtensionForSelectedTemplate = templateFolder;
        if (accountNameToCheckExtension === "" || accountNameToCheckExtension === "Select Organiaztion") {
            return false;
        }
        else if (checkExtensionForSelectedTemplate === "") {
            return;
        }
        else {
            GetRequiredExtension();
        }
    });

    //ON CHANGE OF TEMPLATE- VALIDATE EXTENSION
    $('#selecttmplate').click(function () {
        $('#lblDefaultDescription').hide();
        var templateFolderSelected = $(".template.selected").data('folder');
        var groputempSelected = $(".template.selected").data('template');
        var selectedTemplateDescription = $(".template.selected").data('description');
        var templateIcon = $(".template.selected").data('image');
        var templateName = $(".template.selected").data('template');
        $('#templateIcon').attr('src', templateIcon);
        $('#templateName').innerHTML = templateName;

        var infoMsg = $(".template.selected").data('message');
        if (infoMsg === "" || typeof infoMsg === "undefined" || infoMsg === null) {
            $('#InfoMessage').html('');
            $('#InfoMessage').removeClass('d-block').addClass('d-none');
        }
        else {
            $('#InfoMessage').html(infoMsg);
            $('#InfoMessage').removeClass('d-none').addClass('d-block');
        }
        if (selectedTemplateDescription !== "") {
            $('#descContainer').html(selectedTemplateDescription);
        }
        else {
            $('#descContainer').html("Azure DevOps Demo Generator");
        }
        if (groputempSelected !== "") {
            templateFolder = templateFolderSelected;
            $('#ddlTemplates').val(groputempSelected);
            $(".VSTemplateSelection").fadeOut('fast');
        }
        $(".VSTemplateSelection").removeClass('d-block').addClass('d-none');
        //till here
        $('#status-messages').empty().hide();
        $('#textMuted').removeClass("d-block").addClass("d-none");
        $('#dvProgress').removeClass("d-block").addClass("d-none");
        $('#accountLink').empty();
        $('#finalLink').removeClass("d-block").addClass("d-none");
        $('#errorNotify').removeClass("d-block").addClass("d-none");
        //Added
        $("#projectParameters").hide();
        $("#projectParameters").html('');
        $("#extensionError").html('');
        $("#extensionError").hide();
        $("#lblextensionError").removeClass("d-block").addClass("d-none");
        var TemplateName = templateFolder;
        if (TemplateName === "MyShuttle-Java") {
            $("#NotificationModal").modal('show');
        }
        var Url = 'GetTemplate/';
        $.get(Url, { "TemplateName": TemplateName }, function (data) {
            if (data !== "") {
                var ParsedData = JSON.parse(data);
                var Description = ParsedData.Description;
                var parameters = ParsedData.Parameters;

                if (typeof parameters !== "undefined") {
                    if (parameters.length > 0) {
                        $.each(parameters, function (key, value) {
                            $('<div class="col-lg-12 mt-1"><label for="sonarqubeurl" class="d-block col-form-label" style="font-weight:500">' + value.label + '  :</label><div class="row align-items-center ml-0"><input type="text" class="form-control col mr-3 mt-lg-0 form-input project-parameters rmverrorOn" id="txt' + value.fieldName + '" proj-parameter-name="' + value.fieldName + '" placeholder="' + value.fieldName + '" /></div><div class="alert alert-danger d-none" role="alert" id="txt' + value.fieldName + '_Error"></div></div></div>').appendTo("#projectParameters");
                            //$('<div class="form-group row projParameters row align-items-center ml-0"><label for="sonarqubeurl" class="col-lg-3 col-form-label" style="font-weight:400">' + value.label + ':</label><div class="col-lg-8"><input type="text" class="form-control project-parameters rmverrorOn" id="txt' + value.fieldName + '"  proj-parameter-name="' + value.fieldName + '" placeholder="' + value.fieldName + '"><div class="alert alert-danger d-none" role="alert" id="txt' + value.fieldName + '_Error"></div></div>').appendTo("#projectParameters");
                        });
                        $("#projectParameters").show();
                    }
                    else { $("#projectParameters").html(''); }
                }
            }
        });
        if (TemplateName !== "") {
            checkForInstalledExtensions(TemplateName, function callBack(extensions) {
                if (extensions.message !== "no extensions required" && extensions.message !== "" && typeof extensions.message !== undefined && extensions.message.indexOf("Error") === -1 && extensions.message !== "Template not found") {

                    $("#extensionError").empty().append(extensions.message);
                    $("#extensionError").show();
                    $("#lblextensionError").removeClass("d-none").addClass("d-block");

                    if (extensions.status !== "true") {
                        $("#btnSubmit").prop("disabled", true).removeClass('btn-primary');
                        isExtensionNeeded = true;
                        microsoft = $('#agreeTermsConditions').attr('placeholder');
                        if (microsoft !== "microsoft") {
                            microsoft = "";
                        }
                        ThirdParty = $('#ThirdPartyagreeTermsConditions').attr('placeholder');
                        if (ThirdParty !== "thirdparty") {
                            ThirdParty = "";
                        }
                    } else { $("#btnSubmit").prop("disabled", false).addClass('btn-primary'); }
                }
                else {
                    $("#extensionError").html('');
                    $("#extensionError").hide();
                    $("#lblextensionError").removeClass("d-block").addClass("d-none");
                    $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
                }

            });
        }
        //Till here

        var accountNameToCheckExtension = $('#ddlAcccountName option:selected').val();
        var checkExtensionsForSelectedTemplate = templateFolder;
        ga('send', 'event', 'Selected Template : ', checkExtensionsForSelectedTemplate);
        if (accountNameToCheckExtension === "" || accountNameToCheckExtension === "--select organiaztion--") {
            return false;
        }
        else if (checkExtensionsForSelectedTemplate === "") {
            return;
        }
        else {
            GetRequiredExtension();
        }

    });

    $("body").on("click", "#EmailPopup", function () {
        $("#EmailModal").modal('show');
    });

    //checking for extenisoin start
    var isMicrosoftAgreement = "";
    var isThirdparty = "";
    $('#extensionError').click(function () {
        if (microsoft === "microsoft" && ThirdParty === "thirdparty") {
            isMicrosoftAgreement = $('input[id=agreeTermsConditions]:checked').val();
            isThirdparty = $('input[id=ThirdPartyagreeTermsConditions]:checked').val();
            if (isMicrosoftAgreement === "on" && isThirdparty === "on") {
                $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
                isAgreedTerms = true;
            }
            else {
                $("#btnSubmit").prop("disabled", true).removeClass('btn-primary');
                isAgreedTerms = false;
            }
        }
        else if (microsoft === "microsoft" && ThirdParty === "") {
            isMicrosoftAgreement = $('input[id=agreeTermsConditions]:checked').val();
            isThirdparty = $('input[id=ThirdPartyagreeTermsConditions]:checked').val();
            if (isMicrosoftAgreement === "on") {
                $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
                isAgreedTerms = true;
            }
            else {
                $("#btnSubmit").prop("disabled", true).removeClass('btn-primary');
                isAgreedTerms = false;

            }
        }
        else if (microsoft === "" && ThirdParty === "thirdparty") {
            isMicrosoftAgreement = $('input[id=agreeTermsConditions]:checked').val();
            isThirdparty = $('input[id=ThirdPartyagreeTermsConditions]:checked').val();
            if (isThirdparty === "on") {
                $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
                isAgreedTerms = true;
            }
            else {
                $("#btnSubmit").prop("disabled", true).removeClass('btn-primary');
                isAgreedTerms = false;
            }
        }
    });

    $("#projectParameters").html('');
    var selectedTemplate = templateFolder;

    if (selectedTemplate === "MyShuttle-Java") {
        $("#NotificationModal").modal('show');
    }
    if (selectedTemplate !== "") {
        $("#extensionError").html(''); $("#extensionError").hide(); $("#lblextensionError").hide();
        var Url = 'GetTemplate/';
        $.get(Url, { "TemplateName": selectedTemplate }, function (data) {
            if (data !== "") {
                var ParsedData = JSON.parse(data);
                var Description = ParsedData.Description;
                var parameters = ParsedData.Parameters;
                $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
                if (typeof parameters !== "undefined") {
                    if (parameters.length > 0) {
                        $.each(parameters, function (key, value) {
                            $('<div class="form-group row projParameters"><label for="sonarqubeurl" class="col-lg-3 col-form-label" style="font-weight:400">' + value.label + ':</label><div class="col-lg-8"><input type="text" class="form-control project-parameters rmverrorOn" id="txt' + value.fieldName + '"  proj-parameter-name="' + value.fieldName + '" placeholder="' + value.fieldName + '"><div class="alert alert-danger d-none" role="alert" id="txt' + value.fieldName + '_Error"></div></div>').appendTo("#projectParameters");
                        });
                        $("#projectParameters").show();
                    }
                    else { $("#projectParameters").html(''); }
                }
            }
        });
        if (selectedTemplate !== "" && typeof selectedTemplate !== "undefined") {
            checkForInstalledExtensions(selectedTemplate, function callBack(extensions) {

                if (extensions.message !== "no extensions required" && extensions.message !== "" && typeof extensions.message !== "undefined" && extensions.message.indexOf("Error") === -1 && extensions.message !== "Template not found") {

                    $("#extensionError").empty().append(extensions.message);
                    $("#extensionError").show();
                    $("#lblextensionError").removeClass("d-none").addClass("d-block");

                    if (extensions.status !== "true") {

                        $("#btnSubmit").prop("disabled", true).addClass('btn-primary');
                        isExtensionNeeded = true;
                        microsoft = $('#agreeTermsConditions').attr('placeholder');
                        if (microsoft !== "microsoft") {
                            microsoft = "";
                        }
                        ThirdParty = $('#ThirdPartyagreeTermsConditions').attr('placeholder');
                        if (ThirdParty !== "thirdparty") {
                            ThirdParty = "";
                        }

                    } else { $("#btnSubmit").prop("disabled", false).addClass('btn-primary'); }
                }
                else {
                    $("#extensionError").html('');
                    $("#extensionError").hide();
                    $("#lblextensionError").removeClass("d-block").addClass("d-none");
                    $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
                }

            });
        }
    }

    $(document).keypress(function (e) {
        if (e.which === 13) {
            $('#btnSubmit').click();
            return false;
        }
    });

    //Call create templates 
    createTemplates();

    // load other templates on tab click
    $(document.body).on('click', '.nav-link', function () {
        grpSelected = this.text;
        getGroups(grpSelected);
    });
    $(document.body).on('click', '.nav-item', function () {
        $(".nav-item").removeClass("active_white");
        $(this).addClass("active_white");
    });
    //Group load
    $.ajax({
        url: "../Environment/GetGroups",
        type: "GET",
        success: function (groups) {
            var grp = "";
            if (groups.Groups.length > 0) {
                for (var g = 0; g < groups.Groups.length; g++) {
                    if (g === 0)
                        grp += '<li class="nav-item active_white"><a class="nav-link text-white" id="pills-' + groups.Groups[g] + '-tab" id="pills-' + groups.Groups[g] + '-tab" data-toggle="pill" href="#' + groups.Groups[g] + '" role="tab" aria-selected="true">' + groups.Groups[g] + '</a></li>';
                    else
                        grp += '<li class="nav-item"><a class="nav-link text-white" id="pills-' + groups.Groups[g] + '-tab" data-toggle="pill" href="#' + groups.Groups[g] + '" role="tab" aria-controls="pills-' + groups.Groups[g] + '" aria-selected="false">' + groups.Groups[g] + '</a></li>';
                }
                $('#modtemplateGroup').empty().append(grp);

            }
        }
    });


    var privateTemplateDescription = $('#selectedTemplateDescription').val();
    if (privateTemplateDescription !== "") {
        var templateTxt = $('#descContainer').text();
        if (templateTxt !== "")
            $("#descContainer").html(privateTemplateDescription);
    }
    //If User comes with lab url(private), we will check for PrivatetemplateFolderName in the field
    var publicTemplate = $('#ddlTemplates').val();
    var privateTemplate = $('#selectedTemplateFolder').val();
    if (privateTemplate !== "" || typeof privateTemplate !== "undefined") {
        templateFolder = privateTemplate;
    }
    else {
        templateFolder = publicTemplate;
    }

    AppendMessage();
    var defaultTemplate = $('#selectedTemplate').val();
    $('#ddlTemplates').val(defaultTemplate);

});
$('#btnSubmit').click(function () {
    statusCount = 0;
    $("#txtALertContainer").hide();
    $('#status-messages').hide();
    $("#finalLink").removeClass("d-block").addClass("d-none");

    var projectName = $.trim($("#txtProjectName").val());
    var template = templateFolder;
    var accountName = $('#ddlAcccountName option:selected').val();
    var token = $('#hiddenAccessToken').val();
    var email = $('#emailID').val();
    var regex = /^[A-Za-z0-9 -_]*[A-Za-z0-9][A-Za-z0-9 -_]*$/;
    if (accountName === "" || accountName === "Select Organiaztion") {
        $("#ddlAcccountName_Error").text("Please choose an organization first!");
        $("#ddlAcccountName_Error").removeClass("d-none").addClass("d-block");
        $("#ddlAcccountName").focus();
        return false;
    }
    //checking for session templatename and templateID
    if (projectName === "") {
        $("#txtProjectName_Error").text("Please provide a project name");
        $("#txtProjectName_Error").removeClass("d-none").addClass("d-block");
        return false;
    }
    if (!(regex.test(projectName))) {
        $("#txtAlert").text("Special characters are not allowed for project name");
        $("#txtALertContainer").show();
        $("#txtProjectName").focus();
        return false;
    }
    if (template === "") {
        $("#ddlTemplates_Error").text("Please select Project template");
        $("#ddlTemplates_Error").removeClass("d-none").addClass("d-block");
        return false;
    }
    if (template === "Octopus") {
        var octopusURL = $('#txtOctopusURL').val();
        var octopusAPIkey = $('#txtAPIkey').val();
        if (octopusURL !== "") {
            var pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]\$&'\(\)\*\+,;=.]+$/;

            if (!(pattern.test(octopusURL))) {
                $("#txtOctopusURL_Error").text("Please enter a valid URL.");
                $("#txtOctopusURL_Error").removeClass("d-none").addClass("d-block");
                return false;
            }
        }
        else {
            $("#txtOctopusURL_Error").text("Please enter a valid URL.");
            $("#txtOctopusURL_Error").removeClass("d-none").addClass("d-block");
            return false;
        }
        if (octopusAPIkey === "") {
            $("#txtAPIkey_Error").text("Please enter a valid Octopus Key.");
            $("#txtAPIkey_Error").removeClass("d-none").addClass("d-block");
            return false;
        }
    }

    if (template === "SonarQube") {
        var ServerDNS = $("#txtSonarServerDNSName").val();
        if (ServerDNS === "") {
            $("#txtSonarServerDNSName_Error").text("Please enter sonar server DNS name");
            $("#txtSonarServerDNSName_Error").removeClass("d-none").addClass("d-block");
            return false;
        }
    }

    //get userMethod and selected users
    var SelectedUsers = '';
    var userMethod = $("input[type='radio']:checked").val();
    if (userMethod === "Select") {
        $(".checkbox").each(function () {
            if (this.checked) {
                SelectedUsers = SelectedUsers + this.value + ',';
            }
        });

        if (SelectedUsers.length === 0) {
            $("#txtAlert").text("Please select organiaztion users");
            $("#txtALertContainer").show();
            return false;
        }
    }

    $('#status-messages').html('');
    $('#status-messages').show();
    $("#btnSubmit").prop("disabled", true).removeClass('btn-primary');
    var Parameters = {};
    $.each($('.project-parameters'), function (index, item) {
        Parameters[$("#" + item['id']).attr('proj-parameter-name')] = item["value"];
    });
    selectedTemplate = template;
    var websiteUrl = window.location.href;
    var projData = { "ProjectName": projectName, "SelectedTemplate": template, "id": uniqueId, "Parameters": Parameters, "selectedUsers": SelectedUsers, "UserMethod": userMethod, "SonarQubeDNS": ServerDNS, "isExtensionNeeded": isExtensionNeeded, "isAgreeTerms": isAgreedTerms, "websiteUrl": websiteUrl, "accountName": accountName, "accessToken": token, "email": email };
    $.post("StartEnvironmentSetupProcess", projData, function (data) {

        if (data !== "True") {
            var queryTemplate = '@Request.QueryString["queryTemplate"]';
            window.location.href = "~/Account/Verify?template=" + queryTemplate;
            return;
        }

        appInsights.trackEvent("Create button clicked");
        appInsights.trackEvent("Created project using" + selectedTemplate + " template");
        ga('send', 'event', selectedTemplate, 'selected');
        appInsights.trackEvent("User method" + userMethod);

        $('#ddlGroups').attr("disabled", "disabled");

        $("#ddlAcccountName").attr("disabled", "disabled");
        $("#txtProjectName").attr("disabled", "disabled");
        $("#templateselection").prop("disabled", true).removeClass('btn-primary');
        $("input.terms").attr("disabled", true);
        $("#txtALertContainer").hide();
        $("#accountLink").html('');
        $("#errorNotify").removeClass("d-block").addClass("d-none");
        projectNameForLink = projectName;
        AccountNameForLink = accountName;
        ErrorData = '';
        getStatus();
        $('#dvProgress').removeClass("d-none").addClass("d-block");
        $('#textMuted').removeClass("d-none").addClass("d-block");
    });
    event.preventDefault;
});

// if the user uploading his exported template (zip file), we will take that template name as folder name
$('body').on('click', '#btnUpload', function () {
    var fileUpload = $("#FileUpload1").get(0);
    var files = fileUpload.files;
    $('#InfoMessage').removeClass('d-block').addClass('d-none');
    // Create FormData object
    var fileData = new FormData();
    // Looping over all files and add it to FormData object
    for (var i = 0; i < files.length; i++) {
        fileData.append(files[i].name, files[i]);
    }
    templateFolder = files[0].name.replace(".zip", "");
});

function getStatus() {

    $.ajax({
        url: 'GetCurrentProgress/' + uniqueId,
        type: 'GET',
        success: function (data) {

            if (data === "OAUTHACCESSDENIED") {
                $('#progressBar').width(currentPercentage++ + '%');
                $('#status-messages').append('<i class="fas fa-forward"></i> &nbsp;Third Party application access via OAuth is disabled for this Organization,please change OAuth access setting and try again!<br/>');
                $("#ddlAcccountName").removeAttr("disabled");
                $("#txtProjectName").removeAttr("disabled");
                $("#txtProjectName").val("");
                $('#ddlAcccountName').prop('selectedIndex', 0);

                $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
                $("#templateselection").prop("disabled", false).addClass('btn-primary');
                $('#dvProgress').removeClass("d-block").addClass("d-none");
                $('#textMuted').removeClass("d-block").addClass("d-none");
                return;

            }
            var isMessageShown = true;

            if (jQuery.inArray(data, messageList) === -1) {
                messageList.push(data);
                isMessageShown = false;
            }

            if (data !== "100") {

                if (isMessageShown === false) {
                    if (messageList.length === 1) {
                        $('#progressBar').width(currentPercentage++ + '%');
                        if (data.length > 0) {
                            $('#status-messages').append('<i class="fas fa-check-circle" style="color:green"></i> &nbsp;' + data + '<br/>');
                        }
                    }
                    else {
                        if (data.indexOf("TF50309") === 0) {
                            $('#progressBar').width(currentPercentage++ + '%');
                            $('#status-messages').append('<i class="fas fa-check-circle" style="color:green"></i> &nbsp;' + data + '<br/>');
                            $("#ddlAcccountName").removeAttr("disabled");
                            $("#txtProjectName").removeAttr("disabled");
                            $("#txtProjectName").val("");
                            $('#ddlAcccountName').prop('selectedIndex', 0);

                            $("#btnSubmit").prop("disabled", false);
                            $("#templateselection").prop("disabled", false).addClass('btn-primary');
                            $('#dvProgress').removeClass("d-block").addClass("d-none");
                            $('#textMuted').removeClass("d-block").addClass("d-none");
                            return;
                        }
                        else if (data.indexOf("TF200019") === 0) {
                            $('#progressBar').width(currentPercentage++ + '%');
                            $('#status-messages').append('<i class="fas fa-check-circle" style="color:green"></i> &nbsp;' + data + '<br/>');
                            $("#ddlAcccountName").removeAttr("disabled");
                            $("#txtProjectName").removeAttr("disabled");
                            $("#txtProjectName").val("");
                            $('#ddlAcccountName').prop('selectedIndex', 0);

                            $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
                            $("#templateselection").prop("disabled", false).addClass('btn-primary');
                            $('#dvProgress').removeClass("d-block").addClass("d-none");
                            $('#textMuted').removeClass("d-block").addClass("d-none");
                            return;

                        }
                        else if (data.indexOf("TF200019") === -1) {
                            $('#progressBar').width(currentPercentage++ + '%');
                            $('#status-messages').append('<i class="fas fa-check-circle" style="color:green"></i> &nbsp;' + data + '<br/>');
                        }
                        else {
                            $('#status-messages').append('<i class="fas fa-check-circle" style="color:green"></i> &nbsp;' + data + '<br/>');
                            $("#ddlAcccountName").removeAttr("disabled");
                            $("#txtProjectName").removeAttr("disabled");
                            $("#txtProjectName").val("");
                            $('#ddlAcccountName').prop('selectedIndex', 0);

                            $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
                            $("#templateselection").prop("disabled", false).addClass('btn-primary');
                            $('#dvProgress').removeClass("d-block").addClass("d-none");
                            $('#textMuted').removeClass("d-block").addClass("d-none");

                        }

                    }

                }
                else if (currentPercentage <= ((messageList.length + 1) * percentForMessage) && currentPercentage <= 100) {
                    $('#progressBar').width(currentPercentage++ + '%');
                }
                window.setTimeout("getStatus()", 500);
            }
            else {
                if (messageList.length !== 3) {
                    var ID = uniqueId + "_Errors";
                    var url2 = 'GetCurrentProgress/' + ID;
                    $.get(url2, function (response) {
                        if (response === "100" || response === "") {
                            $.ajax({
                                url: "../Account/GetAccountName/",
                                type: "GET",
                                async: false,
                                success: function (data) {
                                    var accountName = $('#ddlAcccountName option:selected').val();
                                    var projectNameForLink = $("#txtProjectName").val();
                                    var link = "https://dev.azure.com/" + accountName + "/" + projectNameForLink;
                                    var proceedOrg = "<a href='" + link + "' target='_blank'><button type = 'button' class='mt-4 mb-4 btn rd-4 btn-primary btn-sm' id = 'proceedOrg' > Navigate to project</button></a>";
                                    var social = "<p style='color: black; font-weight: 500; margin: 0px;'>Like the tool? Share your feedback &nbsp;";
                                    social += "<script>function fbs_click() { u = 'https://azuredevopsdemogenerator.azurewebsites.net/'; t = +Azure + DevOps + Demo + Generator & window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(u) + '&t=' + encodeURIComponent(t), 'sharer', 'toolbar=0,status=0,width=626,height=436'); return false; }</script>";
                                    var twitter = "<a href='https://twitter.com/intent/tweet?url=https://azuredevopsdemogenerator.azurewebsites.net/&amp;text=Azure+DevOps+Demo+Generator&amp;hashtags=azuredevopsdemogenerator' target='_blank'><img src='/Images/twitter-c.png' style='width:20px;'></a>&nbsp;&nbsp;";
                                    social += twitter;
                                    $('<b style="display: block;">Congratulations! Your project is successfully provisioned.</b>' + proceedOrg + social).appendTo("#accountLink");
                                    $('#dvProgress').removeClass("d-block").addClass("d-none");
                                    $('#textMuted').removeClass("d-block").addClass("d-none");
                                    currentPercentage = 0;

                                    $('#progressBar').width(currentPercentage++ + '%');
                                    $("#finalLink").removeClass("d-none").addClass("d-block");
                                    $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
                                    $("#txtProjectName").val("");

                                    $('#ddlAcccountName').prop('selectedIndex', 0);
                                    $("#templateselection").prop("disabled", false).addClass('btn-primary');

                                    $('#ddlGroups').removeAttr("disabled");
                                    $("#ddlAcccountName").removeAttr("disabled");
                                    $("#txtProjectName").removeAttr("disabled");
                                }
                            });
                        }
                        else {
                            ErrorData = response;
                            var accountName = $('#ddlAcccountName option:selected').val();
                            $("#projCreateMsg").hide();
                            $('#dvProgress').removeClass("d-block").addClass("d-none");
                            $('#textMuted').removeClass("d-block").addClass("d-none");
                            currentPercentage = 0;
                            $('#status-messages').empty().hide();
                            $('#progressBar').width(currentPercentage++ + '%');
                            $("#finalLink").addClass("d-none").removeClass("d-block");
                            $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
                            $("#txtProjectName").val("");

                            $('#ddlAcccountName').prop('selectedIndex', 0);
                            $("#templateselection").prop("disabled", false).addClass('btn-primary');
                            $('#ddlGroups').removeAttr("disabled");
                            $("#ddlAcccountName").removeAttr("disabled");
                            $("#txtProjectName").removeAttr("disabled");
                            if (ErrorData !== '') {
                                $("#projCreateMsg").hide(); $("#errorDescription").html("");
                                $('<b style="display: block;">We ran into some issues and we are sorry about that!</b><p> The log below will provide you insights into why the provisioning failed. You can email us the log  to <a id="EmailPopup"><i>devopsdemos@microsoft.com</i></a> and we will try to help you.</p><p>Click on View Diagnostics button to share logs with us.</p>').appendTo("#errorDescription");
                                $("#errorMail").empty().append(ErrorData);
                                $("#errorNotify").show();
                                $("#errorNotify").removeClass("d-none").addClass("d-block");
                            }
                        }
                    });
                    messageList = [];
                }
            }
        },
        error: function (xhr) {
            getStatus();
        }
    });
}

function DisplayErrors() {
    $("#errorBody").html('<pre>' + ErrorData + '</pre>');
    $("#errorModal").modal('show');
}


function checkForInstalledExtensions(selectedTemplate, callBack) {
    var accountNam = $('#ddlAcccountName option:selected').val();
    var Oauthtoken = $('#hiddenAccessToken').val();
    if (accountNam !== "" && selectedTemplate !== "") {
        $("#btnSubmit").prop("disabled", true).removeClass('btn-primary');
        $('#templateselection').removeClass("btn-primary").prop("disabled", true);
        $.ajax({
            url: "../Environment/CheckForInstalledExtensions",
            type: "GET",
            data: { selectedTemplate: selectedTemplate, token: Oauthtoken, Account: accountNam },
            success: function (InstalledExtensions) {

                callBack(InstalledExtensions);
            }
        });
    }

}

function checkForExtensions(callBack) {
    var accountNam = $('#ddlAcccountName option:selected').val();
    var Oauthtoken = $('#hiddenAccessToken').val();
    var selectedTemplate = templateFolder;
    if (selectedTemplate !== "" && accountNam !== "") {
        $("#imgLoading").show();
        $("#btnSubmit").removeClass('btn-primary').prop("disabled", true);
        $("#ddlAcccountName").prop("disabled", true);
        $("#txtProjectName").prop('disabled', 'disabled');

        $.ajax({
            url: "../Environment/CheckForInstalledExtensions",
            type: "GET",
            data: { selectedTemplate: selectedTemplate, token: Oauthtoken, Account: accountNam },
            success: function (InstalledExtensions) {
                callBack(InstalledExtensions);
            }
        });
    }

}

function GetRequiredExtension() {
    checkForExtensions(function callBack(extensions) {
        if (extensions.message !== "no extensions required" && extensions.message !== "" && typeof extensions.message !== "undefined" && extensions.message.indexOf("Error") === -1 && extensions.message !== "Template not found") {
            $("#imgLoading").hide();
            $("#ddlAcccountName").prop("disabled", false);
            $("#extensionError").empty().append(extensions.message);
            $('#templateselection').addClass("btn-primary").prop("disabled", false);
            $("#extensionError").show();
            $("#lblextensionError").removeClass("d-none").addClass("d-block");
            $("#txtProjectName").prop('disabled', false);
            if (extensions.status !== "true") {
                $("#btnSubmit").prop("disabled", true).removeClass('btn-primary');

                isExtensionNeeded = true;
                microsoft = $('#agreeTermsConditions').attr('placeholder');
                if (microsoft !== "microsoft") {
                    microsoft = "";
                }
                ThirdParty = $('#ThirdPartyagreeTermsConditions').attr('placeholder');
                if (ThirdParty !== "thirdparty") {
                    ThirdParty = "";
                }
            } else { $("#btnSubmit").prop("disabled", false).addClass('btn-primary'); microsoft = ""; ThirdParty = ""; }
        }
        else { $("#imgLoading").hide(); $("#ddlAcccountName").prop("disabled", false); $("#extensionError").html(''); $("#extensionError").hide(); $("#lblextensionError").removeClass("d-block").addClass("d-none"); $("#btnSubmit").addClass('btn-primary').prop("disabled", false); $("#txtProjectName").prop('disabled', false); microsoft = ""; ThirdParty = ""; $('#templateselection').addClass("btn-primary").prop("disabled", false); }

    });
}

//TEMPLATE GROUP CREATION
$(document).ready(function () {

});

$(function () {

    // SHOW MODAL ON EVENT
    $(".template-invoke").on("click", function () {
        $(".VSTemplateSelection").fadeIn('fast');
    });

    // CLOSE MODAL ON EVENT
    $(".template-close").on("click", function () {
        $(".VSTemplateSelection").removeClass('d-block').addClass('d-none');
    });

    // TOGGLING ACTIVE CLASS TO TEMPLATE GROUP
    $(".template-group-item").on('click', function (e) {
        e.preventDefault();
        $(".template-group-item").removeClass('active');
        $(this).addClass('active');
    });

    // TOGGLING SELECTED CLASS TO TEMPLATE

    $(document.body).on("click", '.template', function () {
        $(".template").removeClass("selected");
        $(this).addClass("selected");
        $('.description').removeClass('descSelected');
        $(this.lastElementChild).addClass('descSelected');
    });

    // GET ID TO BE SHOWN
    let showId = $(".template-group-item.active").attr('href');
    $(`.template-body .templates${showId}`).show();
});

function createTemplates() {
    var grpSelected = "General";
    getGroups(grpSelected);
}

//Project name validtaion on keyup


$("#txtProjectName").keyup(function () {

    var projectName = $.trim(this.value);
    var regex = /^(?!_.)[a-zA-Z0-9!^\-`)(]*[a-zA-Z0-9_!^\.)( ]*[^.\/\\~@#$*%+=[\]{\}'",:;?<>|](?:[a-zA-Z!)(][a-zA-Z0-9!^\-` )(]+)?$/;
    if (projectName !== "") {
        var restrictedNames = ["COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9", "COM10", "PRN", "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LTP", "LTP8", "LTP9", "NUL", "CON", "AUX", "SERVER", "SignalR", "DefaultCollection", "Web", "App_code", "App_Browesers", "App_Data", "App_GlobalResources", "App_LocalResources", "App_Themes", "App_WebResources", "bin", "web.config"];
        if (restrictedNames.find(x => x.toLowerCase() === projectName.toLowerCase())) {
            var link = "<a href='https://go.microsoft.com/fwlink/?linkid=842564' target='_blank'>Learn more</a>";
            $("#txtProjectName_Error").html("The project name '" + projectName + "' is invalid " + link);
            $("#txtProjectName_Error").removeClass("d-none").addClass("d-block");
            $("#txtProjectName").focus();
            $('#btnSubmit').removeClass('btn-primary').attr('disabled', 'disabled');
            return false;
        }
        else {
            validateExtensionCheckbox();
        }
        if (!(regex.test(projectName))) {
            var links = "<a href='https://go.microsoft.com/fwlink/?linkid=842564' target='_blank'>Learn more</a>";
            $("#txtProjectName_Error").html("The project name '" + projectName + "' is invalid " + links);
            $("#txtProjectName_Error").removeClass("d-none").addClass("d-block");
            $("#txtProjectName").focus();
            $('#btnSubmit').removeClass('btn-primary').attr('disabled', 'disabled');
            return false;
        }
        else {
            validateExtensionCheckbox();
            return false;
        }
    }
    else {
        $("#txtProjectName_Error").text("");
        $("#txtProjectName_Error").removeClass("d-block").addClass("d-none");
        $('#btnSubmit').addClass('btn-primary').attr('disabled', false);
        return false;
    }
});

function validateExtensionCheckbox() {
    var checkboxMicrosoft = "";
    var checkboxTrirdparty = "";

    $("#txtProjectName_Error").text("");
    $("#txtProjectName_Error").removeClass("d-block").addClass("d-none");

    if (microsoft === "microsoft" && ThirdParty === "thirdparty") {
        checkboxMicrosoft = $('input[id=agreeTermsConditions]:checked').val();
        checkboxTrirdparty = $('input[id=ThirdPartyagreeTermsConditions]:checked').val();
        if (checkboxMicrosoft === "on" && checkboxTrirdparty === "on") {
            $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
            isAgreedTerms = true;
        }
        else {
            $("#btnSubmit").prop("disabled", true).removeClass('btn-primary');
            isAgreedTerms = false;
        }
    }
    else if (microsoft === "microsoft" && ThirdParty === "") {
        checkboxMicrosoft = $('input[id=agreeTermsConditions]:checked').val();
        checkboxTrirdparty = $('input[id=ThirdPartyagreeTermsConditions]:checked').val();
        if (checkboxMicrosoft === "on") {
            $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
            isAgreedTerms = true;
        }
        else {
            $("#btnSubmit").prop("disabled", true).removeClass('btn-primary');
            isAgreedTerms = false;

        }
    }
    else if (microsoft === "" && ThirdParty === "thirdparty") {
        checkboxMicrosoft = $('input[id=agreeTermsConditions]:checked').val();
        checkboxTrirdparty = $('input[id=ThirdPartyagreeTermsConditions]:checked').val();
        if (checkboxTrirdparty === "on") {
            $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
            isAgreedTerms = true;
        }
        else {
            $("#btnSubmit").prop("disabled", true).removeClass('btn-primary');
            isAgreedTerms = false;
        }
    }
    else {
        $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
    }
}

function GetTemplates(selectedTemplate) {
    var Url = 'GetTemplate/';
    $.get(Url, { "TemplateName": selectedTemplate }, function (data) {
        if (data !== "") {
            var ParsedData = JSON.parse(data);
            var Description = ParsedData.Description;
            var parameters = ParsedData.Parameters;
            $("#btnSubmit").prop("disabled", false).addClass('btn-primary');
            if (typeof parameters !== "undefined") {
                if (parameters.length > 0) {
                    $.each(parameters, function (key, value) {
                        $('<div class="form-group row projParameters"><label for="sonarqubeurl" class="col-lg-3 col-form-label" style="font-weight:400">' + value.label + ':</label><div class="col-lg-8"><input type="text" class="form-control project-parameters rmverrorOn" id="txt' + value.fieldName + '"  proj-parameter-name="' + value.fieldName + '" placeholder="' + value.fieldName + '"><div class="alert alert-danger d-none" role="alert" id="txt' + value.fieldName + '_Error"></div></div>').appendTo("#projectParameters");
                    });
                    $("#projectParameters").show();
                }
                else { $("#projectParameters").html(''); }
            }
        }
    });
}

function openImportPopUp() {
    $("#privateTemplatepop").removeClass('d-none').addClass('d-block');
}

function AppendMessage() {

    privateTemplateMsg = $('#infoMessageTxt').val();

    if (privateTemplateMsg !== "" && privateTemplateMsg !== null && typeof privateTemplateMsg !== "undefined") {
        $('#InfoMessage').html(privateTemplateMsg);
        $('#InfoMessage').removeClass('d-none').addClass('d-block');
    }
    else {
        $('#InfoMessage').html('');
        $('#InfoMessage').removeClass('d-block').addClass('d-none');
    }
}

function getGroups(grpSelected) {
    $.ajax({
        url: "../Environment/GetGroups",
        type: "GET",
        success: function (groups) {
            console.log(groups);
            var grp = "";
            var isPrivate = "";
            if (groups.GroupwiseTemplates.length > 0) {
                grp += '<div class="tab-pane show active" id="' + grpSelected + '" role="tabpanel" aria-labelledby="pills-' + grpSelected + '-tab">';
                grp += '<div class="templates d-flex align-items-center flex-wrap">';
                for (var g = 0; g < groups.GroupwiseTemplates.length; g++) {
                    if (groups.GroupwiseTemplates[g].Groups === grpSelected) {
                        var MatchedGroup = groups.GroupwiseTemplates[g];
                        if (MatchedGroup.Template[0].Name === "Private") {
                            $('#selecttmplate').hide();
                            isPrivate += MatchedGroup.Template[0].TemplateFolder;
                            $('#pills-tabContent').html('').html(isPrivate);
                        }
                        else {
                            for (var i = 0; i < MatchedGroup.Template.length; i++) {
                                if (i === 0) {
                                    var templateImg = MatchedGroup.Template[i].Image;
                                    if (templateImg === "" || templateImg === null) {
                                        templateImg = "/Templates/TemplateImages/CodeFile.png";
                                    }
                                    grp += '<div class="col-lg-3 col-md-3 p-p8">';
                                    grp += '<div class="template selected" data-template="' + MatchedGroup.Template[i].Name + '" data-description="' + MatchedGroup.Template[i].Description + '" data-message="' + MatchedGroup.Template[i].Message + '" data-image="' + templateImg + '" data-folder="' + MatchedGroup.Template[i].TemplateFolder + '">';
                                    grp += '<div class="template-box">';
                                    grp += '<div class="template-header">';
                                    grp += '<img class="templateImage" src="' + templateImg + '"/>';
                                    grp += '<strong class="title">' + MatchedGroup.Template[i].Name + '</strong></div >';
                                    if (MatchedGroup.Template[i].Tags !== null) {
                                        grp += '<p></p>';
                                        grp += '<p class="tagz">';
                                        for (var rx = 0; rx < MatchedGroup.Template[i].Tags.length; rx++) {
                                            grp += '<i>' + MatchedGroup.Template[i].Tags[rx] + '</i>';
                                        }
                                        grp += '</p>';
                                    }
                                    let desc = MatchedGroup.Template[i].Description; /*(MatchedGroup.Template[i].Description.length > 70) ? MatchedGroup.Template[i].Description.substr(0, 70) + '...' :*/
                                    grp += '<p class="description descSelected">' + desc + '</p>';
                                    grp += '</div>';
                                    grp += '</div>';
                                     grp += '</div>';
                                }
                                else {
                                    var templateImgs = MatchedGroup.Template[i].Image;
                                    if (templateImgs === "" || templateImgs === null) {
                                        templateImgs = "/Templates/TemplateImages/CodeFile.png";
                                    }
                                    grp += '<div class="col-lg-3 col-md-3 p-p8">';
                                    grp += '<div class="template" data-template="' + MatchedGroup.Template[i].Name + '" data-description="' + MatchedGroup.Template[i].Description + '" data-message="' + MatchedGroup.Template[i].Message + '" data-image="' + templateImg + '" data-folder="' + MatchedGroup.Template[i].TemplateFolder + '">';                                    
                                    grp += '<div class="template-box">';
                                    grp += '<div class="template-header">';
                                    grp += '<img class="templateImage" src="' + templateImgs + '"/>';
                                    grp += '<strong class="title">' + MatchedGroup.Template[i].Name + '</strong></div >';
                                    if (MatchedGroup.Template[i].Tags !== null) {
                                        grp += '<p></p>';
                                        grp += '<p class="tagz">';
                                        for (var x = 0; x < MatchedGroup.Template[i].Tags.length; x++) {
                                            grp += '<i>' + MatchedGroup.Template[i].Tags[x] + '</i>';
                                        }
                                        grp += '</p>';
                                    }
                                    let desc = MatchedGroup.Template[i].Description;
                                    grp += '<p class="description">' + desc + '</p>';
                                    grp += '</div>';
                                    grp += '</div>';
                                    grp += '</div>';
                                }
                            }
                            $('#selecttmplate').show();

                            grp += '</div></div>';
                            $('#pills-tabContent').html('').html(grp);
                        }
                    }
                }

            }
        }
    });
}

