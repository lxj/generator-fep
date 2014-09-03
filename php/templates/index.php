<?php
    $PPSProjectFilePos=strrpos(dirname(__FILE__),"PPSProject");
    $modUrl=substr(dirname(__FILE__),0,$PPSProjectFilePos);
    include ($modUrl.'PPSProject/libraries/template.php');
?>
