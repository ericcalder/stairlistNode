$.get('../cleaners/menu',function(cleaners){
        console.log('in cleaners')
        console.log('claener data='+cleaners[0].cleaner+'id='+cleaners[0].id)
        console.log('data.length='+cleaners.length)
       var list=''
        //$('.dropdown-menu a:eq(1)').append(cleaners[0].cleaner)
        for(k=0;k<cleaners.length;k++){
        var val='<a href="../cleaners/'+cleaners[k].id+
        '&name='+cleaners[k].cleaner+'">'+cleaners[k].cleaner+'</a>'
            list=list.concat(val)
        }
        console.log('list='+list)
        $('.dropdown-menu').empty().append(list)
      })