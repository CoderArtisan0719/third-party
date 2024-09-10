/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { Chart, registerables } from 'chart.js';
import { useMutation } from 'convex/react';
import { addYears, eachYearOfInterval, isSameYear } from 'date-fns';
import React, { useEffect, useRef } from 'react';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

Chart.register(...registerables);

const FiveYearChart = () => {
  const reqMutation = useMutation(api.requests.getByUserId);
  const bidMutation = useMutation(api.bids.getActiveByClientId);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const myChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = sessionStorage.getItem('userInfo');
      const parsedUserInfo = JSON.parse(userInfo!);

      try {
        const res1 = await reqMutation({
          userId: parsedUserInfo._id as Id<'users'>,
          filter: '',
          page: 0,
          perpage: 0,
        });

        const res2 = await bidMutation({
          clientId: parsedUserInfo._id as Id<'users'>,
          filter: '',
          page: 0,
          perpage: 0,
        });

        const xAxis: string[] = [];
        const reqsOnMarket: number[] = [];
        const bidsAccepted: number[] = [];
        const bidsPlaced: number[] = [];

        const from = addYears(new Date(), -5);

        const years = eachYearOfInterval({
          start: from,
          end: new Date(),
        });

        years.forEach((year) => {
          xAxis.push(String(year).slice(11, 15));

          reqsOnMarket.push(
            res1.resolvedRequests.filter((req) =>
              isSameYear(new Date(year), new Date(req._creationTime)),
            ).length,
          );

          bidsAccepted.push(
            res2.bids.filter(
              (req) =>
                isSameYear(new Date(year), new Date(req._creationTime)) &&
                req.status === 'accepted',
            ).length,
          );

          bidsPlaced.push(
            res2.bids.filter(
              (req) =>
                isSameYear(new Date(year), new Date(req._creationTime)) &&
                req.status === 'placed',
            ).length,
          );
        });

        const ctx = chartRef.current;

        if (ctx) {
          if (myChartRef.current) myChartRef.current.destroy();

          myChartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: xAxis,
              datasets: [
                {
                  label: 'Bids placed',
                  data: bidsPlaced,
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                  fill: true,
                },
                {
                  label: 'Bids accepted',
                  data: bidsAccepted,
                  backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                  fill: true,
                },
                {
                  label: 'Requests on the market',
                  data: reqsOnMarket,
                  backgroundColor: 'rgba(239, 68, 68, 0.5)',
                  borderColor: 'rgba(239, 68, 68, 1)',
                  borderWidth: 1,
                  fill: true,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      if (myChartRef.current) {
        myChartRef.current.destroy();
      }
    };
  }, [bidMutation]);

  return <canvas ref={chartRef} width="400" height="200" id="FiveYearChart" />;
};

export default FiveYearChart;
