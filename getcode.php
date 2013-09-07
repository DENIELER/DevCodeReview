<?php
	$inputJSON = file_get_contents('php://input');
	$input = json_decode($inputJSON);
	
	$file = $input->file;
	$content = file_get_contents('/home/devcoder/public_html/data/'.$file);
	
	if(preg_match_all("/\|lang\|(.*?)\|langend\|/", $content, $match))
	{
		$language = $match[1][0];
	}
	if(preg_match_all("/\|oldcode\|((.|\n)*?)\|oldcodeend\|/", $content, $match))
	{
		$oldCode = $match[1][0];
	}
	if(preg_match_all("/\|newcode\|((.|\n)*?)\|newcodeend\|/", $content, $match))
	{
		$newCode = $match[1][0];
	}
	
	echo json_encode(array('language' => $language, 
						   'oldCode' => $oldCode,
						   'newCode' => $newCode));
?>