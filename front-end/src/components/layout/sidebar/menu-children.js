import React,{useState} from "react"; 
import Link from 'next/link'
import { AiFillCaretRight, AiFillCaretDown} from "react-icons/ai";
import { useRouter } from "next/router";


const MenuChild = ({ collapsed, menu, index }) => {
    const [showChild,setShowChild] = useState(false);
    const router = useRouter();
    const currentPath = router.pathname;

    const icon = showChild == true ? <AiFillCaretDown /> : <AiFillCaretRight />;

    const childMenuClasses = showChild
    ? "transition-max-h ease-in duration-700 max-h-screen"
    : "transition-max-h ease-out duration-700 max-h-0";


  return (
    <li key={index}>
      {!collapsed && menu?.children ? (
        <>
          <span
            onClick={() => setShowChild((prev) => !prev)}
            className="flex text-sm items-center justify-between p-2 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-6">{menu.icon}</span>{" "}
              <span>{!collapsed && menu.label}</span>
            </div>
            <div>
              <span className="cursor-pointer">{!collapsed && icon}</span>
            </div>
          </span>
        </>
      ) : (
        <>
          <Link
            className={`${currentPath === menu.href ? 'text-primary font-semibold' : ''} flex text-sm items-center gap-2 hover:bg-yellow hover:text-black rounded py-2 px-2`}
            href={menu.href}
          >
            <span className="w-6">{menu.icon}</span>{" "}
            <span>{!collapsed && menu.label}</span>
          </Link>
        </>
      )}
      {showChild && (
        <ul className={`bg-[#F2F2F6] rounded mx-2 ${childMenuClasses}`}>
          {menu?.children?.map((child, index) => (
            <li key={index} className="px-4 text-sm">
              <Link
                className={`${currentPath === child.href ? 'text-primary font-semibold py-2' : 'py-2'} flex items-center gap-2`}
                href={child.href}
              >
                <span className="text-sm">{child.icon}</span>{" "}
                <span>{!collapsed && child.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default MenuChild;
