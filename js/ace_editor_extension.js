var editor_left = ace.edit("editor_left");
var editor_left_session = editor_left.getSession();
editor_left.setTheme("ace/theme/xcode");

var editor_right = ace.edit("editor_right");
var editor_right_session = editor_right.getSession();
editor_right.setTheme("ace/theme/xcode");
editor_right.setReadOnly(true);
editor_right.container.style.backgroundColor = 'lightgrey';

/*Scrolling*/
editor_left_session.on('changeScrollTop', function(scroll)
{
	var scrollHeight = editor_right.renderer.scrollBar.element.scrollHeight - editor_right.renderer.scrollBar.element.offsetHeight;
	if(scrollHeight > 0 && scrollHeight >= scroll)
	{
		editor_right_session.setScrollTop(parseInt(scroll));
	}
});
editor_left_session.on('changeScrollLeft', function(scroll)
{
	var scrollWidth = editor_right.renderer.scrollBarH.element.scrollWidth - editor_right.renderer.scrollBarH.element.offsetWidth;
	if(scrollWidth > 0 && scrollWidth >= scroll)
	{
		editor_right_session.setScrollLeft(parseInt(scroll));
	}
});

editor_right_session.on('changeScrollTop', function(scroll)
{
	var scrollHeight = editor_left.renderer.scrollBar.element.scrollHeight - editor_left.renderer.scrollBar.element.offsetHeight;
	if(scrollHeight > 0 && scrollHeight >= scroll)
	{
		editor_left_session.setScrollTop(parseInt(scroll));
	}
});
editor_right_session.on('changeScrollLeft', function(scroll)
{
	var scrollWidth = editor_left.renderer.scrollBarH.element.scrollWidth - editor_left.renderer.scrollBarH.element.offsetWidth;
	if(scrollWidth > 0 && scrollWidth >= scroll)
	{
		editor_left_session.setScrollLeft(parseInt(scroll));
	}
});

/*Changing value*/
var signal = 0,
	worker_editor = editor_left, 
	passive_editor = editor_right;
editor_left.on('change', function(changeData)
{
	if(signal == 0)// && (changeData.data.text == '\n' || changeData.data.text == '\r\n'))
	{

		editor_right.container.style.backgroundColor = 'white';
		editor_right.setReadOnly(false);

		if(firstTime && currentStep == 2)
		{
			$('#overlay').css('display', 'block');
			$('#past_new_code_tooltip').css('display', 'block');
		}

		worker_editor = editor_left;
		passive_editor = editor_right;
		compare_editor_values();
	}
});
editor_right.on('change', function(changeData)
{
	if(signal == 0)// && (changeData.data.text == '\n' || changeData.data.text == '\r\n'))
	{
		if(firstTime && currentStep == 3)
		{
			$('#overlay').css('display', 'block');
			$('#share_tooltip').css('display', 'block');

			scrollToAnchor('share_tooltip');
		}

		worker_editor = editor_right;
		passive_editor = editor_left;
		compare_editor_values();
	}
});
		
function compare_editor_values()
{
	signal = 1;
	var worker_lines = worker_editor.getSession().getDocument().getAllLines();
	var passive_lines = passive_editor.getSession().getDocument().getAllLines();

	for(var i=0; i < worker_lines.length; i++)
	{
		if($.trim(worker_lines[i]) == $.trim(passive_lines[i]))
    	{
    		worker_editor.getSession().removeGutterDecoration(i, 'not_matched_row');
    		worker_editor.getSession().removeGutterDecoration(i, 'matched_row');
    		worker_editor.getSession().addGutterDecoration(i, 'matched_row');

			if(!passive_editor.getReadOnly())
			{
    			passive_editor.getSession().removeGutterDecoration(i, 'not_matched_row');
    			passive_editor.getSession().removeGutterDecoration(i, 'matched_row');
    			passive_editor.getSession().addGutterDecoration(i, 'matched_row');
    		}
    	}
    	else
    	{
    		var analogueIndex = -1,
    			analogueIndexPassive = -1;
    		for(var j=i; j < worker_lines.length; j++)
    		{
    			if($.trim(worker_lines[j]) == $.trim(passive_lines[i])
    				&& $.trim(worker_lines[j]).length)
    			{
					analogueIndex = j;
    				break;
    			}
    		}
    		if(analogueIndex == -1)
    		{
    			for(var j=i; j < passive_lines.length; j++)
        		{
        			if($.trim(worker_lines[i]) == $.trim(passive_lines[j])
        				&& $.trim(worker_lines[i]).length)
        			{
    					analogueIndexPassive = j;
        				break;
        			}
        		}	
    		}

    		if(analogueIndex != -1)
    		{
        		for(var k = i; k < analogueIndex; k++)
        		{
        			passive_editor.getSession().getDocument().insert({row:k, column:0}, passive_editor.getSession().getDocument().getNewLineCharacter());
    				passive_lines = passive_editor.getSession().getDocument().getAllLines();
    			}
			}else if(analogueIndexPassive != -1)
			{
				for(var k = i; k < analogueIndexPassive; k++)
        		{
        			worker_editor.getSession().getDocument().insert({row:k, column:0}, worker_editor.getSession().getDocument().getNewLineCharacter());
    				worker_lines = worker_editor.getSession().getDocument().getAllLines();
    			}
			}
			else{
        		worker_editor.getSession().removeGutterDecoration(i, 'not_matched_row');
        		worker_editor.getSession().removeGutterDecoration(i, 'matched_row');
        		worker_editor.getSession().addGutterDecoration(i, 'not_matched_row');

				if(!passive_editor.getReadOnly())
    			{
	        		passive_editor.getSession().removeGutterDecoration(i, 'not_matched_row');
	        		passive_editor.getSession().removeGutterDecoration(i, 'matched_row');
	        		passive_editor.getSession().addGutterDecoration(i, 'not_matched_row');
	        	}
        	}
    	}
	}
	signal = 0;
}
