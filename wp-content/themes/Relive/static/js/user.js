(function($){

	// Collect action
	$('.collect-btn').click(function(){
		var _this = $(this);
		var pid = Number(_this.attr('pid'));
		var collect = Number(_this.children("span").text()); 
		if(_this.attr('uid')&&!_this.hasClass('collect-yes')){
			var uid = Number(_this.attr('uid'));
			$.ajax({type: 'POST', xhrFields: {withCredentials: true}, dataType: 'html', url: xintheme.ajax_url, data: 'action=collect&uid=' + uid + '&pid=' + pid + '&act=add', cache: false,success: function(response){if(response!=0)_this.children("span").text(collect+1);_this.removeClass("collect-no").addClass("collect-yes").attr("title","已收藏");_this.children('i').attr('class','iconfont icon-collection_fill');}});		
			return false;
		}else if(_this.attr('uid')&&_this.hasClass('collect-yes')&&_this.hasClass('remove-collect')){
			var uid = Number(_this.attr('uid'));
			$.ajax({type: 'POST', xhrFields: {withCredentials: true}, dataType: 'html', url: xintheme.ajax_url, data: 'action=collect&uid=' + uid + '&pid=' + pid + '&act=remove', cache: false,success: function(response){if(response!=0)_this.children("span").text(collect-1);_this.removeClass("collect-yes").addClass("collect-no").attr("title","点击收藏");_this.children('i').attr('class','iconfont icon-collection');}});
			return false;
		}else{
			return;
		}   	
	});

	// Change cover
	$("#custom-cover").click(function(A){
		A.preventDefault();
		A.returnValue=false;
		$("#cover-change").fadeIn();return false
	});
	$("#cover-list ul li a.basic").click(function(A){
		A.preventDefault();
		A.returnValue=false;
		if($(this).hasClass("selected")){return}
			F=$(this).children('img').attr('src');
		var C=$("#cover img"),B=F.replace('-small','');
		C.attr("src",B);
		$("#cover-list ul li a.selected").removeClass("selected");
		$(this).addClass("selected");return false
	});
	$("#cover-close,#cover-cancle").click(function(A){
		A.preventDefault();
		A.returnValue=false;
		$("#cover-change").fadeOut();
		return false
	});
	$("#cover-sure").bind('click',function(A){
		A.preventDefault();
		A.returnValue=false;
		var B=$(this).attr("curuserid");
		F=F!==''?F.replace('-small',''):default_cover;
		$.ajax({
			type:"POST",
			dataType:'json',
			url:xintheme.ajax_url,
			data:{"action":"author_cover","user":B,"cover":F},
			beforeSend:function(){$(this).addClass("loading")},
			success:function(C){
				$(this).removeClass("loading");
				if(C.success===1){$("#cover-close").click()}
			}
		});
		return false;return false
	});

	// Upload cover
	$("a#upload-cover").click(function(G){
		G.preventDefault();
		var I=$(this),B=$("a#uploaded-cover").children("img"),C=$("#cover img");
		formfield=B.attr("src");
		tb_show("",xintheme.admin_url+"media-upload.php?type=image&TB_iframe=true");
		window.send_to_editor=function(D){
			imgurl=$("img",D).attr("src");
			B.attr('src',xintheme.timthumb+imgurl+"&w=240&h=64&zc=1&q=100");C.attr('src',xintheme.timthumb+imgurl+"&w=1000&h=265&zc=1&q=100");
			var F = xintheme.timthumb+imgurl+"&w=1000&h=265&zc=1&q=100";
			var E = $("#cover-sure").attr("curuserid");
			$.ajax({
				type:"POST",
				dataType:'json',
				url:xintheme.ajax_url,
				data:{"action":"author_cover","user":E,"cover":F},
				success:function(C){
					if(C.success===1){$("#cover-close").click()}
				}
			});
			tb_remove();
		};return false
	});
	
	// function get cookie
	function umGetCookie(c_name){
		if (document.cookie.length>0){
			c_start=document.cookie.indexOf(c_name + "=");
			if (c_start!=-1){ 
				c_start=c_start + c_name.length+1;
				c_end=document.cookie.indexOf(";",c_start);
				if (c_end==-1) c_end=document.cookie.length;
				return unescape(document.cookie.substring(c_start,c_end));
			}
		}
		return ""
	};
	// 关注
	$('.follow-btn').click(function(){
		//if(um_check_login()){
		var $this = $(this);
		var followed = $this.data('uid'),
			act = $this.data('act'),
			wp_nonce =  umGetCookie('um_check_nonce');
		$.ajax({
			type: 'POST',
			url: xintheme.ajax_url,
			dataType: 'json',
			data: {
				'action' : 'follow',
				'followed' : followed,
				'act' : act,
				'wp_nonce' : wp_nonce
			},
			success : function(response){
				if($.trim(response)==='NonceIsInvalid'){
					set_um_nonce();
					umAlert('操作失败,请重试');
				}else if(response.success===1){
					switch(response.type){
						case 1:
							$this.data('act','disfollow');
							$this.removeClass('unfollowed').removeClass('current').addClass('followed');
							$this.parent().children('.pm-btn').addClass('current');
							$this.html('<i class="fa fa-check"></i>已关注');
							break;
						case 2:
							$this.data('act','disfollow');
							$this.removeClass('unfollowed').removeClass('current').addClass('followed');
							$this.parent().children('.pm-btn').addClass('current');
							$this.html('<i class="fa fa-exchange"></i>互相关注');
							break;
						default:
							$this.data('act','follow');
							$this.removeClass('followed').addClass('current unfollowed');
							$this.parent().children('.pm-btn').removeClass('current');
							$this.html('<i class="fa fa-plus"></i>关 注');
					}
				}else{
					umAlert(response.msg);
				}
			},

		});
		//}
	});
	
	// 用户微信二维码
	$('.as-weixin,.as-donate').bind('mouseover',function(){
	  $(this).children('.as-qr').css('display','block').stop().animate({
		bottom : 45,
		opacity : 1 
	  },500);
	}).bind('mouseleave',function(){
		$(this).children('.as-qr').hide().css('bottom',60);
	});

	$('.as-donate').bind('click',function(){
		if($(this).parent().children('form#alipay-gather').length>0)$(this).parent().children('form#alipay-gather').submit();
	});
	
	//上传头像
	$('#edit-umavatar').click(function(){
		$('#upload-input').slideToggle();
	})
	$('#upload-umavatar').click(function(){
		var file = $('#upload-input input[type=file]').val();
		if(file==''){
			$('#upload-avatar-msg').html('请选择一个图片').slideDown();
			setTimeout(function(){$('#upload-avatar-msg').html('').slideUp();},2000);
		}else{
		   document.getElementById('info-form').enctype = "multipart/form-data";
			$('form#info-form').submit();
		} 
	})


	
})(jQuery);