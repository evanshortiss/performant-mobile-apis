[
  '{{repeat(20)}}',
  {
    _id: '{{objectId()}}',
    index: '{{index()}}',
    isActive: '{{bool()}}',
    duration: '{{floating(0, 10)}}',
    picture: 'http://placehold.it/32x32',
    frequency: '{{integer(1, 10)}}',
    severity: '{{random("green", "yellow", "red")}}',
    name: '{{firstName()}} {{surname()}}',
    company: '{{company().toUpperCase()}}',
    email: '{{email()}}',
    phone: '+1 {{phone()}}',
    address: {
      number: '{{integer(100, 999)}}',
      street: '{{street()}}',
      city: '{{city()}}',
	    state: '{{state()}}',
      country: 'US',
      zip: '{{integer(100, 10000)}}'
    },
    about: '{{lorem(2, "paragraphs")}}',
    registered: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss Z")}}',
    latitude: '{{floating(-90.000001, 90)}}',
    longitude: '{{floating(-180.000001, 180)}}',
    tags: [
      '{{repeat(7)}}',
      '{{lorem(1, "words")}}'
    ]
  }
];
