//
// return validation message after user send your name/email by form
//

function getStatus() {
    return location.search.split('contato=')[1] ? location.search.split('contato=')[1] : false;
}

if(getStatus() === 'sucesso'){
    alert('Formulário enviado com sucesso!');
}
else if(getStatus() === 'erro'){
    alert('Erro ao enviar formulário, preencha corretamente os campos.');
}

//
// start document ready function
//

$(document).ready(function() {

  // close mobile menu after click
  $('.navbar-collapse ul li a:not(.dropdown-toggle)').bind('click touchstart', function () {
    $('.navbar-toggle:visible').click();
  });

  // open modal on start
  $('#bannerCampaing').modal('show');

  // bullet open and close
  var $bgs = $(".zoomin-image");

  $(".bullet__icon").click(function() {
    var $target = $($(this).data('target')).stop(true).fadeToggle();
    $bgs.not($target).filter(':visible').stop(true, true).fadeToggle();
  })

  // youtube modal video
  $(".btn-watch").click(function () {
    var theModal = $(this).data("target"),
    videoSRC = $(this).attr("data-video"),
    videoSRCauto = videoSRC;
    $(theModal + ' iframe').attr('src', videoSRCauto);
    $(theModal + ' button.close').click(function () {
      $(theModal + ' iframe').attr('src', '');
    });
  });

  // close modal and stop youtube audio video
  $('#videoCampaing').on('hidden.bs.modal', function (e) {
    $('#videoCampaing').find('iframe').attr('src', '');
  });

  // arrow down animation
  $.fn.flash = function(duration, iterations) {
    duration = duration || 1000; // Default to 1 second
    iterations = iterations || 1; // Default to 1 iteration

    var iterationDuration = Math.floor(duration / iterations);

    for (var i = 0; i < iterations; i++) {
      this.fadeOut(iterationDuration).fadeIn(iterationDuration);
    }
    return this;
  }

  $("#scroll-down").flash(10000, 10);

  // scroll to top
  $(function(){
    $(window).scroll(function(){
      if ($(this).scrollTop() > 1000) {
        $('#scroll-to-top').fadeIn(1500);
      } else {
        $('#scroll-to-top').fadeOut(1500);
      }
    });

    $('#scroll-to-top a').click(function(){
      $('body,html').animate({
        scrollTop: 0
      }, 500);
      return false;
    });
  });

  $("#scroll-to-top").hide();

  // formulario message validation
  $("#formSent").hide();
  $("#submit").click(function(){
    $(".error").hide();
    var hasError = false;
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

    /**
    * Bloco de validação
    **/

    // var assuntoVal = $(".formAssunto");
    // if(assuntoVal.val() === '') {
    //     assuntoVal.attr('placeholder','Você esqueceu de preencher o assunto!');
    //     hasError = true;
    // }

    var nameVal = $(".formName");
    if(nameVal.val() === '') {
      nameVal.attr('placeholder','Você esqueceu de preencher seu nome!');
      hasError = true;
    }

    var emailFromVal = $(".formAdress");
    if(emailFromVal.val() === '') {
      emailFromVal.attr('placeholder', 'Você esqueceu de preencher seu e-mail!');
      hasError = true;
    } else if(!emailReg.test(emailFromVal.val())) {
      emailFromVal.val('').attr('placeholder','Por favor preencha um e-mail válido!');
      hasError = true;
    }

    // var messageVal = $(".message");
    // if(messageVal.val() === '') {
    //     messageVal.attr('placeholder','Por favor escreva alguma mensagem!');
    //     hasError = true;
    // }

    // se n tem erros
    if(hasError === false) {
      // esconde o btn de submit
      $(this).hide();

      // faz o ajax
      $.ajax({
        type: 'POST',
        url: 'others/sendmail.php',
        data: {
          // subject: assuntoVal.val(),
          name: nameVal.val(),
          emailFrom: emailFromVal.val(),
          // message: messageVal.val()

        },
        success: function(data){
          $("#formToSend").slideUp('slow');
          $("#formSent").slideDown('slow');
        },
        //dataType: dataType
      });
    }

    return false;

  });

});

//
// handle links with @href started with '#' only
//

$(document).on('click', 'a[href^="#"]', function(e) {
  // target element id
  var id = $(this).attr('href');

  // target element
  var $id = $(id);
  if ($id.length === 0) {
    return;
  }

  // prevent standard hash navigation (avoid blinking in IE)
  e.preventDefault();

  // top position relative to the document
  var pos = $(id).offset().top - 80;

  // animated top scrolling
  $('body, html').animate({scrollTop: pos}, 500);
});
