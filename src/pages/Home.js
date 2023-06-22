import { Card } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import not from '../assets/not.png';
import { ExpTitle } from '../constants/constants';

const HomePage = () => {
  const navigate = useNavigate();

  const expList = [
    {
      title: ExpTitle[0],
      path: 'exp1',
      image: not
    },
    {
      title: ExpTitle[1],
      path: 'exp2',
      image: not
    },
    {
      title: ExpTitle[2],
      path: 'exp3',
      image: not
    },
    {
      title: ExpTitle[3],
      path: 'exp4',
      image: not
    },
    {
      title: ExpTitle[4],
      path: 'exp5',
      image: not
    },
    {
      title: ExpTitle[5],
      path: 'exp6',
      image: not
    }
  ]
  return (
    <div className='w-full h-full p-10 select-none ' >
      <div className='w-full h-full flex flex-wrap gap-5 md:gap-10 lg:gap-32 justify-between items-center ' >
        {
          expList.map((item, i) => {
            return (
              <Card
                className='borderColor shadow mb-5 md:mb-0'
                hoverable
                style={{ width: 300, height: 300, background: '#398ab9',color:'#F1F1F2' }}
                cover={item.image && <img className='p-[7px]' alt="" src={item.image} />}
                key={i + 1}
                onClick={() => { navigate(`/${item.path}`) }}>
                {/* <Divider /> */}
                <span className='font-bold' >{item.title}</span>
              </Card>
            )
          })
        }
      </div>
    </div>
  )
}
export default HomePage