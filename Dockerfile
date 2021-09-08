FROM citrixg11n/radar:21.9.7

ADD dist/index.js /

CMD [ "node", "/index.js" ]
# mute actione
##CMD ["/bin/true"]
