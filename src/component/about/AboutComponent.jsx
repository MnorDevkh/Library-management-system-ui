import { CheckOutlined, ClockCircleOutlined } from "@ant-design/icons";
import SiderBar from "../home/component/SideBar";
import MenuComponent from "../MenuComponent";

const listItems = [
  "បង្កើនចំណេះដឹងទូទៅរបស់ប្រជាជន (តាមរយៈសៀវភៅ និងសៀវភៅអេឡិចត្រូនិក)",
  "លើកកម្ពស់វប្បធម៌អាន និងស្រាវជ្រាវ",
  "លើកកម្ពស់ការយល់ដឹងអំពីខ្លួនឯងជាសិស្ស និងអ្នកស្រាវជ្រាវ",
  "អភិវឌ្ឍជំនាញដែលអាចផ្ទេរបាន",
  "អាចវាយតម្លៃខ្លួនឯងតាមលក្ខណៈវិនិច្ឆ័យច្បាស់លាស់",
  "លើកទឹកចិត្តការរៀនដោយផ្តោតលើសិស្ស និងការរៀនដោយឯករាជ្យ",
];

const ListTimeServices = [
  "07:30 ព្រឹក ដល់ 07:30 ល្ងាច (ច័ន្ទ-សុក្រ)",
  "07:30 ព្រឹក ដល់ 12:00 ថ្ងៃត្រង់ (សៅរ៍)",
];

export default function AboutComponent() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <section
        className="mx-auto max-w-7xl p-4 flex flex-row justify-between items-center bg-cover bg-center"
        style={{
          backgroundImage: "url('./src/assets/banner.png')",
          height: "350px",
        }}
      ></section>
      <MenuComponent />
      <div>
        <h1 className="text-2xl font-bold m-4 dark:text-white text-primary-color text-center">
          ព័ត៌មានសង្ខេបពីបណ្ណាល័យ
        </h1>
        <p className="mb-4 lg:px-28 indent-6 p-5 leading-9 dark:text-white text-primary-color">
          បណ្ណាល័យគឺជាកន្លែងដែលសិស្សទាំងអស់អាចធ្វើការស្វែងយល់ដោយខ្លួនឯង
          ដើម្បីរកចំណេះដឹង។ វិទ្យាស្ថានអាហ្គា
          មានបណ្ណាល័យធំទូលាយដែលផ្ដល់សេវាទាំងពីរ៖ ការអាន និងការខ្ចីសៀវភៅ។
          ដើម្បីបំពេញតម្រូវការរបស់សិស្ស អ្នកបង្រៀន បុគ្គលិក និងអ្នកស្រាវជ្រាវ។
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary-color/10 dark:bg-primary-color/5 p-4 rounded">
            <h2 className="text-xl text-primary-color dark:text-white font-semibold mb-2">
              បំណងរបស់បណ្ណាល័យ:
            </h2>
            <ul className="list-none leading-9">
              {listItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary-color/10 dark:bg-primary-color/5 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2 dark:text-white text-primary-color">
              ម៉ោងបម្រើសេវា:
            </h2>
            <ul className="list-none leading-9">
              {ListTimeServices.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold m-4 dark:text-white text-primary-color text-center">
            ទីតាំងរបស់បណ្ណាល័យ
          </h1>
          <p>
            នៅអាគារ វិទ្យាស្ថានអាហ្គាជាន់ទី៣ ដែលស្ដិតនៅ ផ្ទះលេខ៥៨៣ភូមិទ្រា៣
            សង្កាត់ស្ទឺងមានជ័យ ខណ្ឌមានជ័យ រាជធានាភ្នំពេញ
          </p>
          <div className="max-w-auto mt-5 px-2">
            <iframe
              className="w-full h-60 md:h-96 rounded-lg border border-gray-300"
              src="https://www.google.com/maps?q=11.539401254919847,104.886675368546666&hl=es;z=14&output=embed"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Library Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
