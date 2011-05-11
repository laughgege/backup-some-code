<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8" />
<title>Hot Positions</title>
<link rel="stylesheet" href="styles/efadvancement.css" />
<link rel="stylesheet" href="styles/efadvancement_paging.css" />
<!--[if lt IE 9]>
<script type="text/javascript" src="js/html5.js"></script>
<![endif]-->
<script type="text/javascript" src="js/jquery-1.5.1.min.js"></script>
<script type="text/javascript" src="js/paging.js"></script>
</head>
<body>

<div class="efadv_fixmaster">
<!--#include file="header.asp"-->
<section class="efadv_main fix">
	<aside class="efadv_left">
		<article class="efadv_hotpos_left">
			<h3>Hot positions</h3>
			<ul>
				<li><a href="###">iPhone Developer</a></li>
				<li><a href="###">Senior .Net Developer</a></li>
				<li><a href="###">Manager of Volunteer Services</a></li>
				<li><a href="###">Senior SAP Manager</a></li>
				<li><a href="###">Multimedia System Developer</a></li>
			</ul>
		</article>
		<article class="efadv_ad_left">
			<a href="###"><img alt="pic" src="images/lft_col_img1.jpg" /></a> 
			<a href="###"><img alt="pic" src="images/lft_col_img2.jpg" /></a>
			<a href="###"><img alt="pic" src="images/lft_col_img3.jpg" /></a>
		</article>
	</aside>
	<section class="efadv_rightcol">
		<h2>Positions in City A</h2>
		<ul class="efadv_list">
			<li class="efadv_gray fix">
				<span class="efadv_list_col1"><a href="###">iPhone Developer</a></span>
				<span class="efadv_list_col2">shanghai beijing guangzhou shenzhen</span>2010-10-10</li>
			<li>
				<span class="efadv_list_col1"><a href="###">iPhone Developer</a></span>
				<span class="efadv_list_col2">shanghai beijing</span>2010-10-10</li>
			<li class="efadv_gray">
				<span class="efadv_list_col1"><a href="###">iPhone Developer</a></span>
				<span class="efadv_list_col2">shanghai beijing</span>2010-10-10</li>
			<li>
				<span class="efadv_list_col1"><a href="###">iPhone Developer</a></span>
				<span class="efadv_list_col2"></span>2010-10-10</li>
			<li class="efadv_gray">
				<span class="efadv_list_col1"><a href="###">iPhone Developer</a></span>
				<span class="efadv_list_col2">shanghai beijing</span>2010-10-10</li>
		</ul>
		<div id="efadv_paging_holder" class="efadv_paging_holder"></div>
	</section>
</section>
<!--#include file="footer.asp"-->
</div>

<script type="text/javascript">
(function ($) {
    $(function () {
        new Paging(20, 2, "#efadv_paging_holder", handlePageChange);
    });

    function handlePageChange(n){
		
    }
})(jQuery);
</script>
</body>
</html>
