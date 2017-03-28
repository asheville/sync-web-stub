var animationEnd = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';

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

/* Class assignment based on viewport size */
var checkViewportHeight = function() {
  var bodyContentHeight = 0;

  $('body').children().each(function() {
    if ($(this).css('display') !== 'none' && $(this).css('opacity') !== '0') {
      bodyContentHeight = bodyContentHeight + $(this).outerHeight();

      if ($(this).prop('tagName') === 'SECTION') {
        var fromTop = ($(window).height() - $(this).outerHeight()) / 2;
        bodyContentHeight = bodyContentHeight + fromTop + 10;
      }
    }
  });

  if (bodyContentHeight >= $(window).height()) {
    $('body').addClass('exceeds-viewport-height');
  } else {
    $('body').removeClass('exceeds-viewport-height');
  }
};

$(window).on('resize', checkViewportHeight);

$(document).ready(function() {
  /* Body children size change detection */

  $.each($('body').children(), function(index, child) {
    new ResizeSensor(child, function() {
      checkViewportHeight();
    });
  });

  /* Body children animation detection */

  $.each($('body').children(), function(index, child) {
    $(child).on(animationEnd, checkViewportHeight);
  });

  /* Intro prompt */

  setTimeout(function() {
    $('section.intro-prompt form input').focus();
  }, 1500);

  $('section.intro-prompt form').submit(function() {
    var email = $('section.intro-prompt form input.email').val().trim();

    if (!email) {
      $('section.intro-prompt form input.email').focus();
      return false;
    }

    $('section.intro-prompt form button').addClass('pending');

    var resource = {
      data: {
        type: 'contactVerificationRequests',
        attributes: {
          method: 'email',
          contact: email,
          createUser: true,
          authenticateSession: true,
          createNotificationRequests: [{
            event: 'Initial app launch'
          }],
          clientOrigin: window.location.origin
        }
      }
    };

    $.post({
      url: 'https://@@SYNC_WEB_SERVER_HOST/contact-verification-requests',
      data: JSON.stringify(resource),
      contentType: 'application/json',
      success: function(resource) {
        $('section.intro-prompt form button').removeClass('pending');
        $('section.intro-prompt').addClass('hidden');
        $('footer').remove();

        $('section.intro-prompt').on(animationEnd, function() {
          $('section.intro-prompt').remove();
          $('section.intro-prompt-success').show();
        
          setTimeout(function() {
            $('section.intro-prompt-success').addClass('shown');
          }, 510);
        });
      }
    }).fail(function(xhr, textStatus, status) {
      var errorElement = $('<div class="error"><p>Sorry, we were unable to process your email address for some reason.</p><p>Please try again.</p></div>');

      if ($('section.intro-prompt .error').length) {
        $('section.intro-prompt form .error').replaceWith(errorElement);
      } else {
        $('section.intro-prompt form').before(errorElement);
      }

      $('section.intro-prompt form button').removeClass('pending');
      checkViewportHeight();
    });

    return false;
  });

  /* Contact verification request */

  $('section.contact-verification-request form').submit(function() {
    $('section.contact-verification-request form button').addClass('pending');

    $.ajax({
      url: 'https://@@SYNC_WEB_SERVER_HOST' + window.location.pathname,
      type: 'PATCH',
      xhrFields: {
        withCredentials: true
      },
      data: JSON.stringify({
        data: {
          id: window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1),
          type: 'contactVerificationRequests',
          attributes: {
            code: getUrlParameter('code'),
            verified: true
          }
        }
      }),
      contentType: 'application/json',
      success: function(resource) {
        $('section.contact-verification-request form button').removeClass('pending');
        $('section.contact-verification-request').addClass('hidden');
        $('section.contact-verification-request').on(animationEnd, function() {
          $('section.contact-verification-request').remove();
          $('section.contact-verification-request-success').show();

          setTimeout(function() {
            $('section.contact-verification-request-success').addClass('shown');
          }, 510);
        });
      }
    }).fail(function(xhr, textStatus, status) {
      var errorElement = $('<div class="error"><p>Sorry, we were unable to verify your email address for some reason.</p><p>Please try again.</p></div>');

      if ($('section.contact-verification-request .error').length) {
        $('section.contact-verification-request form .error').replaceWith(errorElement);
      } else {
        $('section.contact-verification-request form').before(errorElement);
      }

      $('section.contact-verification-request form button').removeClass('pending');
    });

    return false;
  });
});