<?php
	$inputJSON = file_get_contents('php://input');
	$input = json_decode($inputJSON);
	
	$language = $input->language;
	$old_code = $input->oldCode;
	$new_code = $input->newCode;
	
	$content = "|lang|".$language.
			   "|langend|\n".
			   "|oldcode|".$old_code.
			   "|oldcodeend|\n".
			   "|newcode|".$new_code.
			   "|newcodeend|";
	
	$file = tempnam("data", "code-".date("Y_m_d_H_i_s"));
	file_put_contents($file, $content);

	echo basename($file);
?>