const iota = require('./get_tips');
iota.api.findTransactionObjects({'approvees': ['KFBIIEJRBFILJAMTXPSLXIAFNSNR9FR9TGW9VTUMFXLDLMPTKGYNNPEZTRWEJKXWF9CVMEGIZMYW99999']}, function(error, tips_objects){
  console.log(tips_objects)
});
