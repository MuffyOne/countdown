import moment from 'moment';

jest.mock('./Time.service', () => {
  const actual = jest.requireActual('./Time.service');
  const mockedGetNow = jest.fn(actual.getNow);
  return {
    __esModule: true,
    ...actual,
    getNow: mockedGetNow,
    getDurationFromNow: (endDate) => actual.getDuration(mockedGetNow(), endDate),
  };
});

import * as TimeService from './Time.service';

describe('Time service', () => {
  describe('getDuration', () => {
    it('should return correct seconds, minutes, hours, days', () => {
      const startDate = '2019-03-04 09:30:26';
      const endDate = '2019-03-10 10:45:58';
      const actual = TimeService.getDuration(startDate, endDate);
      const expected = {
        days: 6,
        minutes: 15,
        hours: 1,
        seconds: 32
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('getDurationFromNow', () => {
    it('should return the difference between now and end date', () => {
      const now = moment('2019-03-04 09:30:26');
      TimeService.getNow.mockReturnValue(now);
      const endDate = '2019-03-10 10:45:58';
      const actual = TimeService.getDurationFromNow(endDate);
      const duration = moment.duration(moment(endDate).diff(now));
      const expected = {
        days: Math.floor(duration.asDays()),
        minutes: duration.minutes(),
        hours: duration.hours(),
        seconds: duration.seconds()
      };
      expect(actual).toEqual(expected);
      TimeService.getNow.mockReset();
    });

    it('should handle end dates within the same minute', () => {
      const now = moment('2019-03-04 09:30:26');
      TimeService.getNow.mockReturnValue(now);
      const endDate = '2019-03-04 09:30:27';
      const actual = TimeService.getDurationFromNow(endDate);
      const duration = moment.duration(moment(endDate).diff(now));
      const expected = {
        days: Math.floor(duration.asDays()),
        minutes: duration.minutes(),
        hours: duration.hours(),
        seconds: duration.seconds()
      };
      expect(actual).toEqual(expected);
      TimeService.getNow.mockReset();
    });
  });
});
