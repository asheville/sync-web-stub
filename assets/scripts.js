// From http://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

/* Replace all img tags with svg tags on load
 *
 * From http://stackoverflow.com/questions/24933430/img-src-svg-changing-the-fill-color
 */
$(document).ready(function() {
  jQuery('img.svg').each(function(){
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function(data) {
      // Get the SVG tag, ignore the rest
      var $svg = jQuery(data).find('svg');

      // Add replaced image's ID to the new SVG
      if(typeof imgID !== 'undefined') {
        $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG
      if(typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass+' replaced-svg');
      }

      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');

      // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
      if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
        $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
      }

      // Replace image with new SVG
      $img.replaceWith($svg);
    }, 'xml');
  });
});

$(document).ready(function() {
  /* Intro prompt */

  setTimeout(function() {
    $('section.intro-prompt form input').focus();
  }, 4000);

  $('section.intro-prompt form').submit(function() {
    var email = $('section.intro-prompt form input.email').val().trim();

    if (!email) {
      $('section.intro-prompt form input.email').focus();
      return false;
    }

    $('section.intro-prompt form button').addClass('pending');

    var resource = {
      'data': {
        'type': 'contactVerificationRequest',
        'attributes': {
          'method': 'email',
          'contact': email,
          'createUser': true,
          'createSession': true,
          'createNotificationRequests': [{
            event: 'Initial app launch'
          }],
          'clientHost': window.location.origin
        }
      }
    };

    $.post({
      url: 'https://127.0.0.1:9090/contactVerificationRequests',
      data: JSON.stringify(resource),
      contentType: 'application/json',
      success: function(resource) {
        console.log('form post response', resource);
        $('section.intro-prompt form button').removeClass('pending');
        $('section.intro-prompt').addClass('hidden');
        $('section.intro-prompt-success').addClass('shown');
      }
    }).fail(function(xhr, textStatus, status) {
      var errorElement = $('<div class="error"><p>Sorry, we were unable to process your email address for some reason.</p><p>Please try again.</p></div>');

      if ($('section.intro-prompt .error').length) {
        $('section.intro-prompt form .error').replaceWith(errorElement);
      } else {
        $('section.intro-prompt form').before(errorElement);
      }

      $('section.intro-prompt form button').removeClass('pending');
    });

    return false;
  });

  $('section.contact-verification-request form').submit(function() {
    $('section.contact-verification-request form button').addClass('pending');

    $.ajax({
      url: 'https://127.0.0.1:9090' + window.location.pathname,
      type: 'PUT',
      xhrFields: {
        withCredentials: true
      },
      data: JSON.stringify({
        'data': {
          'type': 'contactVerificationRequest',
          'attributes': {
            id: window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1),
            code: getUrlParameter('code'),
            verified: true
          }
        }
      }),
      contentType: 'application/json',
      success: function(resource) {
        $('section.contact-verification-request form button').removeClass('pending');
        $('section.contact-verification-request').addClass('hidden');
        $('section.contact-verification-request-success').addClass('shown');
      }
    }).fail(function(xhr, textStatus, status) {
      if ($('section.contact-verification-request .error').length) {
        $('section.contact-verification-request form .error').replaceWith('<div class="error"><p>' + xhr.responseText + '</p></div>');
      } else {
        $('section.contact-verification-request form').before('<div class="error"><p>' + xhr.responseText + '</p></div>');
      }

      $('section.contact-verification-request form button').removeClass('pending');
    });

    return false;
  });
});