'use client'
import data from '@/Content.json';
import Education from '@/components/Education';

export default function Educationpage() {
    return <Education education={data.education} />
}