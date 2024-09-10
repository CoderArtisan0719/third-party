/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { Chart, registerables } from 'chart.js';
import { useMutation } from 'convex/react';
import {
  addMonths,
  eachDayOfInterval,
  getDate,
  getMonth,
  isSameDay,
} from 'date-fns';
import React, { useEffect, useRef } from 'react';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

Chart.register(...registerables);

const CurrentChart = () => {
  const bidMutation = useMutation(api.bids.getActiveByClientId);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const myChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = sessionStorage.getItem('userInfo');
      const parsedUserInfo = JSON.parse(userInfo!);

      try {
        const res = await bidMutation({
          clientId: parsedUserInfo._id as Id<'users'>,
          filter: '',
          page: 0,
          perpage: 0,
        });

        const xAxis: string[] = [];
        const bidsReceived: number[] = [];
        const bidsAccepted: number[] = [];
        const bidsRevised: number[] = [];

        const from = addMonths(new Date(), -1);

        const days = eachDayOfInterval({
          start: from,
          end: new Date(),
        });

        days.forEach((day) => {
          xAxis.push(`${getMonth(day) + 1}/${getDate(day)}`);

          bidsReceived.push(
            res.bids.filter((req) =>
              isSameDay(new Date(day), new Date(req._creationTime)),
            ).length,
          );

          bidsAccepted.push(
            res.bids.filter(
              (req) =>
                isSameDay(new Date(day), new Date(req._creationTime)) &&
                req.status === 'accepted',
            ).length,
          );

          bidsRevised.push(
            res.bids.filter(
              (req) =>
                isSameDay(new Date(day), new Date(req._creationTime)) &&
                req.status === 'rework',
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
                  label: 'Bids received',
                  data: bidsReceived,
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
                  label: 'Bids revised',
                  data: bidsRevised,
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

  return <canvas ref={chartRef} width="400" height="200" id="CurrentChart" />;
};

export default CurrentChart;
