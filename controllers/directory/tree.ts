import Group from './group';
import fillAndSubmitForm from './auth';
import convertHtmlToJson, { ListData } from './scrape';
import { IProfessor } from '../../models/professor';
import { getProfDataFromBCWebsite, FacultyInfo } from '../syncProfs';

export enum School {
  MCAS = 'https://www.bc.edu/content/bc-web/schools/morrissey/faculty/mcas-directory/jcr:content/facultyList/faculty-list.items.html',
  CSOM = 'https://www.bc.edu/content/bc-web/schools/carroll-school/faculty-research/faculty-expertise/jcr:content/facultyList/faculty-list.items.html',
  SSW = 'https://www.bc.edu/content/bc-web/schools/ssw/faculty/faculty-expertise/jcr:content/facultyList/faculty-list.items.html',
  CSON = 'https://www.bc.edu/content/bc-web/schools/cson/faculty-research/faculty-directory/jcr:content/facultyList/faculty-list.items.html',
  LSOE = 'https://www.bc.edu/content/bc-web/schools/lynch-school/faculty-research/faculty-directory-expertise/jcr:content/facultyList/faculty-list.items.html',
  WCAS = 'https://www.bc.edu/content/bc-web/schools/wcas/about/faculty-research/faculty-directory/jcr:content/facultyList/faculty-list.items.html',
}

/**
 * Builds a tree structure representing a directory of groups and members.
 *
 * @param {string} rootUrl - The URL of the root group in the directory.
 * @param {string} name - The name of the root group.
 * @param {number} depth - The current layer of the tree (default = 0)
 * @param {School | undefined} school - The name of the parent school for the group (default = undefined)
 * @returns {Promise<Group>} - The root of the tree structure representing the directory.
 */
async function buildTree(
  rootUrl: string,
  name: string,
  depth: number = 0,
  school: School | undefined = undefined
): Promise<Group> {
  // Create root group
  let root = new Group(name);

  // Set school based on name
  if (depth == 1) {
    // Update school
    switch (name) {
      case 'Carroll School of Management':
        school = School.CSOM;
        break;
      case 'Connell School of Nursing':
        school = School.CSON;
        break;
      case 'Lynch School of Education & Human Development':
        school = School.LSOE;
        break;
      case 'Morrissey College of Arts & Sciences':
        school = School.MCAS;
        break;
      case 'Social Work, School of':
        school = School.SSW;
        break;
      case "Woods College of Advancing Studies, Dean's Office":
        school = School.WCAS;
        break;
      default:
        school = undefined;
        break;
    }
  }

  // Get data for the root group from the directory
  const rootHTML: string[] = await fillAndSubmitForm(rootUrl);

  let allListData: ListData = { departments: [] };

  for (const page of rootHTML) {
    // Parse HTML into JSON objects of group members and owned groups
    const { tableData, listData } = convertHtmlToJson(page);

    // Add child groups to list
    allListData = listData;

    for (const tableEntry of tableData) {
      let moreProfData: FacultyInfo | null;

      // Only get more data if group is child of a school
      if (school) {
        moreProfData = await getProfDataFromBCWebsite(tableEntry.name, school);
      } else {
        moreProfData = null;
      }

      const newProf: IProfessor = <IProfessor>{
        name: tableEntry.name,
        title: tableEntry.roles || undefined,
        phone: tableEntry.phone || undefined,
        email: moreProfData ? moreProfData.email : undefined,
        office: moreProfData ? moreProfData.office : undefined,
        education: moreProfData ? moreProfData.education : undefined,
        photoLink: moreProfData?.photoLink
          ? 'https://bc.edu' + moreProfData.photoLink
          : 'https://bc.edu/content/dam/bc1/schools/mcas/Faculty%20Directory/no-profile-image_335x400px.jpg',
      };

      root.addMember(newProf);
      //}
    }
  }
  // Print currrent layer of tree
  root.print(depth);

  // Recursively fill the tree
  for (const listItem of allListData.departments) {
    root.addSubgroup(
      await buildTree(listItem.link, listItem.name, depth + 1, school)
    );
  }

  return root;
}

export default buildTree;
