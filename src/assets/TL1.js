var TL = require("../js/timeline");
TL = TL.TL._originalL;

TL.adapter = function(responseData) {
    var timeline = {title: '', events: ''};
    var title = {text: '', media: ''};
    var eventGroup = {media: '', text: '', start_date: '', unique_id:''};
    var eventGroupArray = [];
    var detailDate;
    var media = {url: '', caption: '', credit: ''};
    var text = {text: '', headline: ''};
    var start_date = {day: '', month: '', year: ''};

    media.url = responseData.picUrl;
    media.caption = responseData.picDes;
    media.credit = responseData.content;
    text.text = responseData.content;
    text.headline = responseData.title;
    title.media = media;
    title.text = text;
    timeline.title = title;
   
    for (var i = 0; i < responseData.details.length; i++) {
        media = {url: '', caption: '', credit: ''};
        text = {text: '', headline: ''};
        start_date = {day: '', month: '', year: ''};
        eventGroup = {media: '', text: '', start_date: ''};

        media.url = responseData.details[i].picUrl;
        media.caption = responseData.details[i].title;
        media.credit = responseData.details[i].picDes;
        detailDate = new Date(responseData.details[i].occurrenceTime);
        start_date.day = detailDate.getDate();
        start_date.month = detailDate.getMonth();
        start_date.year = detailDate.getFullYear();
        text.headline = responseData.details[i].title;
        text.text = responseData.details[i].content;
        eventGroup.media = media;
        eventGroup.start_date = start_date;
        eventGroup.text = text;
        eventGroup.unique_id = '' + responseData.details[i].id;
        eventGroupArray.push(eventGroup);
    }
    this.latestUpdateTime = responseData.details[responseData.details.length - 1].occurrenceTime;
    timeline.events = eventGroupArray;
    this.subjectTitle = timeline.title.text.headline;
    return timeline;
}

export default TL;